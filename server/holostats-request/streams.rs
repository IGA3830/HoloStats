use anyhow::Result;
use chrono::{DateTime, Utc};
use futures::future::TryFutureExt;
use holostats_tracing::json;
use reqwest::Url;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;
use std::str::FromStr;
use tracing::instrument;

use super::RequestHub;

#[derive(Debug)]
pub struct Stream {
    pub id: String,
    pub title: String,
    pub channel_id: String,
    pub status: StreamStatus,
    pub start_time: Option<DateTime<Utc>>,
    pub end_time: Option<DateTime<Utc>>,
    pub schedule_time: Option<DateTime<Utc>>,
    pub viewers: Option<i32>,
}

#[derive(Debug)]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

#[derive(Deserialize, Debug)]
pub struct VideosListResponse {
    pub items: Vec<Video>,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Video {
    pub id: String,
    pub snippet: Option<Snippet>,
    pub live_streaming_details: Option<LiveStreamingDetails>,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Snippet {
    pub channel_id: String,
    pub title: String,
}

#[skip_serializing_none]
#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveStreamingDetails {
    pub actual_start_time: Option<DateTime<Utc>>,
    pub actual_end_time: Option<DateTime<Utc>>,
    pub scheduled_start_time: Option<DateTime<Utc>>,
    pub concurrent_viewers: Option<String>,
}

impl RequestHub {
    #[instrument(name = "Fetch YouTube Streams", skip(self, ids))]
    pub async fn youtube_streams(&self, ids: &[String]) -> Result<Vec<Stream>> {
        let mut streams = Vec::with_capacity(ids.len());

        // youtube limits 50 streams per request
        for chunk in ids.chunks(50) {
            let videos = self.youtube_videos_api(&chunk.join(",")).await?;

            streams.extend(videos.into_iter().filter_map(|video| {
                match (video.snippet, video.live_streaming_details) {
                    (Some(snippet), Some(detail)) => Some(Stream {
                        id: video.id,
                        title: snippet.title,
                        channel_id: snippet.channel_id,
                        status: if detail.actual_end_time.is_some() {
                            StreamStatus::Ended
                        } else if detail.actual_start_time.is_some() {
                            StreamStatus::Live
                        } else {
                            StreamStatus::Scheduled
                        },
                        start_time: detail.actual_start_time,
                        end_time: detail.actual_end_time,
                        schedule_time: detail.scheduled_start_time,
                        viewers: detail
                            .concurrent_viewers
                            .and_then(|v| i32::from_str(&v).ok()),
                    }),
                    _ => None,
                }
            }));
        }

        Ok(streams)
    }

    #[instrument(
        name = "Call YouTube vidoes API",
        skip(self),
        fields(http.method = "GET", id),
    )]
    async fn youtube_videos_api(&self, id: &str) -> Result<Vec<Video>> {
        let url = Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/videos",
            &[
                ("part", "id,liveStreamingDetails,snippet"),
                ("fields", "items(id,liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime,concurrentViewers),snippet(title,channelId))"),
                ("maxResults", "50"),
                ("key", self.youtube_api_key()),
                ("id", id),
            ],
        )?;

        let res = self
            .client
            .get(url.clone())
            .send()
            .and_then(|res| res.json::<VideosListResponse>())
            .await?;

        tracing::info!(videos = json(&res.items));

        Ok(res.items)
    }
}
