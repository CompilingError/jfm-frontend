export const zh = {
  nav: {
    movies: '电影',
    review: '审核',
    tags: '标签',
    artists: '演员',
    settings: '设置',
  },

  common: {
    remove: '移除',
    add: '添加',
    none: '无',
    yes: '是',
    no: '否',
  },

  pages: {
    movies: {
      title: '电影列表',
    },

    review: {
      title: '待审核',
      description: '扫描监视目录中的新文件，并在确认后导入数据库。',
      scanButton: '扫描监视目录',
      scanning: '扫描中...',
      scanFailed: '扫描失败，请确认后端正在运行。',
      empty: '暂无待审核文件。',
      pendingCount: '待审核文件数量：{{count}}',
    },

    tags: {
      title: '标签管理',
    },

    artists: {
      title: '演员管理',
    },
  },

  settings: {
    title: '设置',
    description: '管理监视目录、扫描文件类型，以及新增文件的默认处理方式。',

    backendStatus: {
      title: '后端连接状态',
      description: '检查前端是否可以连接到本地运行的后端服务。',
      checking: '检查中',
      connected: '已连接',
      disconnected: '未连接',
      retry: '重新检查',
    },

    watchedFolders: {
      title: '监视目录',
      description: '应用会扫描并监视这些目录中的新文件。',
      addButton: '添加目录',
      empty: '还没有添加监视目录。',
    },

    allowedExtensions: {
      title: '包括的文件类型',
      description: '只有这些扩展名的文件会被扫描。默认包括 .mp4 和 .pdf。',
      inputPlaceholder: '例如 .mkv',
      addButton: '添加类型',
      invalidMessage: '文件类型必须以 . 开头，例如 .mp4',
      removeAriaLabel: '移除 {{extension}}',
    },

    pendingReview: {
      title: '新增文件处理',
      checkboxLabel: '监视目录中扫描到的新文件默认进入审核页面',
      hint: '当前只保存这个设置。新文件如何显示在审核页面，会在下一步实现。',
    },
  },

  fileCard: {
    coverPlaceholder: '封面',
    noArtists: '暂无演员',
    noTags: '暂无标签',

    actions: {
      like: '标记喜欢',
      unlike: '取消喜欢',
    },

    fields: {
      path: '路径',
      description: '描述',
      like: '喜欢',
      freshVal: '新鲜度',
      lastWatchedTime: '上次观看',
    },
  },
};