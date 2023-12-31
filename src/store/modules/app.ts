import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { ElMessage } from 'element-plus'
import { ElementPlusSize } from '@/types/elementPlus'
import { useCache } from '@/hooks/web/useCache'
import { LayoutType } from '@/types/layout'
import { ThemeTypes } from '@/types/theme'
import { JwtUserType } from '@/api/login/types'
import { ProjectUserType, SystemRoleEnum, UserInfoType } from '@/api/sys/types'
import { PlatformType } from '@/types/platform'

const { wsCache } = useCache()
const TOKEN_NAME = 'YM-TOKEN'

const JWT_INFO_NAME = 'ymUserJwtInfo'
const USER_INFO_NAME = 'ymUserInfo'
const CURRENT_PROJECT_KEY = 'ymCurrentProjectId'
const CURRENT_MAP_KEY = 'ymCurrentMapJson'
const PERMISSION_KEY = 'ymPermission'

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  userInfo: UserInfoType | null
  userJwtInfo: JwtUserType | null
  currentProjectId: number
  currentPlatform: PlatformType
  currentMapJson: string
  permissions: string[]
  token: string
  reservoirName: string
  isDark: boolean
  currentSize: ElementPlusSize
  sizeMap: ElementPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
  ProjectStatus: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: wsCache.get(USER_INFO_NAME) || null,
      userJwtInfo: wsCache.get(JWT_INFO_NAME) || null,
      token: wsCache.get(TOKEN_NAME) || '',
      currentProjectId: wsCache.get(CURRENT_PROJECT_KEY) || 0,
      currentMapJson: wsCache.get(CURRENT_MAP_KEY) || '', // 地图JSON文件字符串
      currentPlatform: 'workshop',
      permissions: wsCache.get(PERMISSION_KEY) || [],
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
      reservoirName: '',
      ProjectStatus: '',
      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: false, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: wsCache.get('dynamicRouter') || false, // 是否动态路由
      fixedMenu: wsCache.get('fixedMenu') || false, // 是否固定菜单

      layout: wsCache.get('layout') || 'top', // layout布局
      isDark: wsCache.get('isDark') || false, // 是否是暗黑模式
      currentSize: wsCache.get('default') || 'default', // 组件尺寸
      theme: wsCache.get('theme') || {
        // 主题色
        elColorPrimary: '#409eff',
        // 左侧菜单边框颜色
        leftMenuBorderColor: 'inherit',
        // 左侧菜单背景颜色
        leftMenuBgColor: '#001529',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '#0f2438',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单字体颜色
        leftMenuTextColor: '#bfcbd9',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '#fff',
        // logo字体颜色
        logoTitleTextColor: '#fff',
        // logo边框颜色
        logoBorderColor: 'inherit',
        // 头部背景颜色
        topHeaderBgColor: '#fff',
        // 头部字体颜色
        topHeaderTextColor: 'inherit',
        // 头部悬停颜色
        topHeaderHoverColor: '#f6f6f6',
        // 头部边框颜色
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getReservoirName(): string {
      return this.reservoirName
    },
    getProjectStatus(): string {
      return this.ProjectStatus
    },
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserJwtInfo(): JwtUserType | null {
      return this.userJwtInfo
    },
    getUserInfo(): UserInfoType | null {
      return this.userInfo
    },
    getToken(): string {
      return this.token
    },
    /**
     * 当前用户工作的项目，如果是系统管理员都是0，否则都会设置
     */
    getCurrentProjectId(): number {
      return this.currentProjectId
    },
    /**
     * 当前项目id所在的项目信息
     */
    getCurrentProject(): ProjectUserType | undefined {
      return this.userInfo?.projectUsers.find((x) => x.projectId === this.currentProjectId)
    },
    /**
     * 当前项目的地图JSON
     */
    getCurrentMapJson(): string {
      return this.currentMapJson
    },
    getCurrentPlatform(): PlatformType {
      return this.currentPlatform
    },
    getPermissions(): string[] {
      return this.permissions || wsCache.get(PERMISSION_KEY)
    },
    getIsSysAdmin(): boolean {
      const jwtInfo = this.userJwtInfo || wsCache.get(JWT_INFO_NAME)
      if (!jwtInfo) {
        return false
      }
      return jwtInfo['systemRole'] === SystemRoleEnum.SYS_ADMIN
    },
    getIsProjectAdmin(): boolean {
      const jwtInfo = this.userJwtInfo || wsCache.get(JWT_INFO_NAME)
      if (!jwtInfo) {
        return false
      }
      return jwtInfo['systemRole'] === SystemRoleEnum.PROJECT_ADMIN
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ElementPlusSize {
      return this.currentSize
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    }
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      wsCache.set('dynamicRouter', dynamicRouter)
      this.dynamicRouter = dynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      wsCache.set('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其他布局')
        return
      }
      this.layout = layout
      wsCache.set('layout', this.layout)
    },
    setUserJwtInfo(user: JwtUserType | null) {
      wsCache.set(JWT_INFO_NAME, user)
      this.userJwtInfo = user
    },
    setUserInfo(user: UserInfoType) {
      wsCache.set(USER_INFO_NAME, user)
      this.userInfo = user
    },
    setToken(token: string) {
      wsCache.set(TOKEN_NAME, token)
      this.token = token
    },
    setreservoirName(reservoirName: string) {
      this.reservoirName = reservoirName
    },
    setProjectStatus(ProjectStatus: string) {
      this.ProjectStatus = ProjectStatus
    },

    setCurrentProjectId(projectId: number) {
      wsCache.set(CURRENT_PROJECT_KEY, projectId)
      // 同时设置是否是项目管理员的状态，不能的用户可能属于多个项目
      this.currentProjectId = projectId
    },
    setCurrentMapJson(mapJson: string) {
      wsCache.set(CURRENT_MAP_KEY, mapJson)
      this.currentMapJson = mapJson
    },
    setCurrentPlatform(platform: PlatformType) {
      this.currentPlatform = platform
    },
    setPermissions(permissions: string[]) {
      wsCache.set(PERMISSION_KEY, permissions)
      this.permissions = permissions
    },
    setUserDefaultProject(projectId: number) {
      this.getUserInfo?.projectUsers.forEach((p) => {
        p.defaultProject = p.projectId === projectId
      })
      if (this.getUserInfo) {
        this.setUserInfo(this.getUserInfo)
      }
    },
    setTitle(title: string) {
      this.title = title
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      wsCache.set('isDark', this.isDark)
    },
    setCurrentSize(currentSize: ElementPlusSize) {
      this.currentSize = currentSize
      wsCache.set('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
      wsCache.set('theme', this.theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
    },
    setFooter(footer: boolean) {
      this.footer = footer
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
