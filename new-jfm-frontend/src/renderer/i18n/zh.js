export const zh = {
  nav: {
    movies: '电影',
    review: '审核',
    tags: '标签',
    artists: '演员',
    settings: '设置',
  },

  pages: {
    movies: {
      title: '电影列表',
    },
    review: {
      title: '待审核',
    },
    tags: {
      title: '标签管理',
    },
    artists: {
      title: '演员管理',
    },
  },

  common: {
    remove: '移除',
    add: '添加',
  },

  settings: {
    title: '设置',
    description: '管理监视目录、扫描文件类型，以及新增文件的默认处理方式。',

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
};