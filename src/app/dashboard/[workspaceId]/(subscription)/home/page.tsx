import { getAllUserVideos, howToPost } from '@/actions/workspace'
import HowToPost from '@/components/global/how-to-post'
import VideoCard from '@/components/global/videos/video-card'
import React from 'react'

type Props = {
  params: { workspaceId: string }
}

const Home = async ({params}: Props) => {
  const workspaceId = params.workspaceId
  const post = await howToPost()
  const videos = await getAllUserVideos(workspaceId)

  return (
    <div className="flex items-center justify-center flex-col gap-2">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:w-1/2">
        {videos.status === 200
          ? videos.data?.map((video) => (
              <VideoCard
                key={video.id}
                {...video}
                workspaceId={video.workSpaceId!}
              />
            ))
          : ''}
        <HowToPost
          title={post?.title}
          html={post?.content}
        />
      </div>
    </div>
  )
}

export default Home
