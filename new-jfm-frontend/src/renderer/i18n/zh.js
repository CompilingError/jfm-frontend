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
    save: '保存',
    cancel: '取消',
  },

  pages: {
    movies: {
      title: '电影列表',
      description: '查看已经导入数据库的电影文件。',
      refresh: '刷新',
      loading: '加载中...',
      loadFailed: '加载电影列表失败，请确认后端正在运行。',
      empty: '暂无电影。',
      totalCount: '电影数量：{{count}}',
      pageInfo: '第 {{current}} / {{total}} 页',
      previousPage: '上一页',
      nextPage: '下一页',
      updateFailed: '更新电影失败，请检查后端状态。',
      deleteFailed: '删除电影失败，请检查后端状态。',
      deleteConfirm: '确定要删除“{{name}}”吗？',
    },

    review: {
      title: '待审核',
      description: '扫描监视目录中的新文件，并在确认后导入数据库。',
      scanButton: '扫描监视目录',
      scanning: '扫描中...',
      scanFailed: '扫描失败，请确认后端正在运行。',
      empty: '暂无待审核文件。',
      pendingCount: '待审核文件数量：{{count}}',
      enterSelectionMode: '批量选择',
      exitSelectionMode: '退出选择',
      selectedCount: '已选择：{{count}}',
      selectAll: '全选',
      clearSelection: '取消选择',
      importing: '正在导入...',
      importFailed: '导入失败，请检查后端状态或数据是否重复。',

      batch: {
        tagLabel: '批量标签',
        artistLabel: '批量演员',
        selectExistingTag: '选择已有标签',
        selectExistingArtist: '选择已有演员',
        newTagPlaceholder: '新标签名称',
        newArtistPlaceholder: '新演员名称',
        assign: '添加',
        createAndAssign: '新建并添加',
        approveSelected: '批量审核通过',
      },
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

  movieCard: {
    coverPlaceholder: '封面',
    generatingCover: '生成封面中...',
    noArtists: '暂无演员',
    noTags: '暂无标签',
    detailsTitle: '详情',

    actions: {
      like: '标记喜欢',
      unlike: '取消喜欢',
      edit: '编辑',
      delete: '删除',
    },

    fields: {
      path: '路径',
      description: '描述',
      like: '喜欢',
      freshVal: '新鲜度',
    },
  },

  movieFilter: {
    title: '筛选',
    expand: '展开筛选',
    collapse: '收起筛选',
    name: '名称',
    namePlaceholder: '关键词',
    like: '喜欢',
    likeAll: '全部',
    tags: '标签',
    artists: '演员',
    tagPlaceholder: '搜索标签',
    artistPlaceholder: '搜索演员',
    tagMode: '标签模式',
    artistMode: '演员模式',
    modeAll: '全部匹配',
    modeAny: '任意匹配',
    minFreshVal: '最低新鲜度',
    maxFreshVal: '最高新鲜度',
    apply: '应用筛选',
    clear: '清空筛选',
  },

  movieEditModal: {
    title: '编辑电影',

    fields: {
      name: '名称',
      path: '路径',
      description: '描述',
      like: '喜欢',
      freshVal: '新鲜度',
      tags: '标签',
      artists: '演员',
    },

    placeholders: {
      newTag: '新标签名称',
      newArtist: '新演员名称',
    },

    errors: {
      nameRequired: '名称不能为空。',
      pathRequired: '路径不能为空。',
    },
  },

  fileCard: {
    coverPlaceholder: '封面',
    generatingCover: '生成封面中...',
    noArtists: '暂无演员',
    noTags: '暂无标签',
    detailsTitle: '详情',

    actions: {
      like: '标记喜欢',
      unlike: '取消喜欢',
      select: '选择文件',
      unselect: '取消选择文件',
      edit: '编辑',
      approve: '审核通过',
    },

    fields: {
      path: '路径',
      description: '描述',
      like: '喜欢',
      freshVal: '新鲜度',
      lastWatchedTime: '上次观看',
    },
  },

  reviewEditModal: {
    title: '编辑待审核文件',

    fields: {
      name: '名称',
      description: '描述',
      like: '喜欢',
      tags: '标签',
      artists: '演员',
    },

    placeholders: {
      newTag: '新标签名称',
      newArtist: '新演员名称',
    },

    unresolvedDefaultTags: '以下默认标签还没有匹配到数据库标签：{{names}}',

    errors: {
      nameRequired: '名称不能为空。',
    },
  },
};