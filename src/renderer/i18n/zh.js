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
      updateSuccess: '电影已更新。',
      deleteFailed: '删除电影失败，请检查后端状态。',
      deleteSuccess: '电影已删除。',
      deleteConfirm: '确定要删除“{{name}}”吗？',
      openFailed: '打开文件或更新观看状态失败。',
      likeSuccess: '已标记喜欢。',
      unlikeSuccess: '已取消喜欢。',
      watchedSuccess: '已更新观看状态。',
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
      scanSuccess: '扫描完成，发现 {{count}} 个待审核文件。',
      editSuccess: '待审核文件已更新。',
      noSelection: '请先选择至少一个文件。',
      assignTagSuccess: '已为 {{count}} 个文件添加标签：{{name}}。',
      assignArtistSuccess: '已为 {{count}} 个文件添加演员：{{name}}。',
      importSuccess: '已导入：{{name}}。',
      batchImportSuccess: '已导入 {{count}} 个文件。',
      batchImportPartialSuccess: '已导入 {{count}} 个文件，部分文件导入失败。',

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
        loadOptionsFailed: '加载标签或演员失败。',
        createTagFailed: '新建标签失败。',
        createArtistFailed: '新建演员失败。',
      },
    },

    tags: {
      title: '标签管理',
      description: '管理电影标签。左键编辑，右键搜索关联电影。',
      createPlaceholder: '输入新标签名称',
      empty: '暂无标签。',
      loadFailed: '加载标签失败。',
      emptyName: '标签名称不能为空。',
      createSuccess: '标签已创建：{{name}}。',
      createFailed: '创建标签失败。',
      updateSuccess: '标签已更新：{{name}}。',
      updateFailed: '更新标签失败。',
      editTitle: '编辑标签：{{name}}',
      searchRelatedMovies: '搜索关联电影',
    },

    artists: {
      title: '演员管理',
      description: '管理演员信息。左键编辑，右键搜索关联电影。',
      createPlaceholder: '输入新演员名称',
      empty: '暂无演员。',
      loadFailed: '加载演员失败。',
      emptyName: '演员名称不能为空。',
      createSuccess: '演员已创建：{{name}}。',
      createFailed: '创建演员失败。',
      updateSuccess: '演员已更新：{{name}}。',
      updateFailed: '更新演员失败。',
      editTitle: '编辑演员：{{name}}',
      searchRelatedMovies: '搜索关联电影',
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

    messages: {
      loadFailed: '加载设置失败。',
      addFolderSuccess: '监视目录已添加。',
      addFolderFailed: '添加监视目录失败。',
      removeFolderSuccess: '监视目录已移除。',
      removeFolderFailed: '移除监视目录失败。',
      addExtensionSuccess: '文件类型已添加。',
      addExtensionFailed: '添加文件类型失败。',
      removeExtensionSuccess: '文件类型已移除。',
      removeExtensionFailed: '移除文件类型失败。',
      pendingReviewUpdateSuccess: '新增文件处理设置已更新。',
      pendingReviewUpdateFailed: '更新新增文件处理设置失败。',
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
    sort: '排序',
    sortNewest: '最新导入',
    sortOldest: '最早导入',
    sortNameAsc: '名称 A-Z',
    sortNameDesc: '名称 Z-A',
    sortFreshHigh: '新鲜度高到低',
    sortFreshLow: '新鲜度低到高',
    sortLikedFirst: '喜欢优先',
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