export type WorkspaceProps = {
  data: {
    subscription: {
      plan: 'NONE' | 'MONTHLY' | 'YEARLY'
    } | null
    workspace: {
      id: string
      name: string
      type: 'PUBLIC' | 'PERSONAL'
    }[]
    members: {
      WorkSpace: {
        id: string
        name: string
        type: 'PUBLIC' | 'PERSONAL'
      }
    }[]
  }
}

export type NotificationProps = {
  status: number
  data: {
    _count: {
      notification: number
    }
  }
}

export type FolderProps = {
  status: number
  data: {
    name: string
    _count: {
      videos: number
    }
  }
}

export type VideosProps = {
  status: number
  data: {
    User: {
      name: string | null
      image: string | null
    } | null
    id: string
    processing: boolean
    Folder: {
      id: string
      name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
  }[]
}

export type VideoProps = {
  status: number
  data: {
    User: {
      name: string | null
      image: string | null
      trial: boolean
      subscription: {
        plan: 'NONE' | 'MONTHLY' | 'YEARLY'
      } | null
    } | null
    title: string | null
    description: string | null
    source: string
    views: number
    createdAt: Date
    processing: boolean
    summery: string
  }
  author: boolean
}

export type CommentRepliesProps = {
  id: string
  comment: string
  createdAt: Date
  commentId: string | null
  userId: string | null
  videoId: string | null
  User: {
    id: string
    email: string
    name: string | null
    createdAt: Date
    image: string | null
    trial: boolean
    firstView: boolean
  } | null
}

export type VideoCommentProps = {
  data: {
    User: {
      id: string
      email: string
      name: string | null
      createdAt: Date
      image: string | null
      trial: boolean
      firstView: boolean
    } | null
    reply: CommentRepliesProps[]
    id: string
    comment: string
    createdAt: Date
    commentId: string | null
    userId: string | null
    videoId: string | null
  }[]
}
