import { ref, unref, computed } from 'vue'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { useCssVar } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { trim, setCssVar } from '@/utils'

export const useTheme = () => {
  const appStore = useAppStore()
  const layout = computed(() => appStore.getLayout)

  const setSystemTheme = (color: string) => {
    setCssVar('--el-color-primary', color)
    appStore.setTheme({ elColorPrimary: color })
    const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
    setMenuTheme(trim(unref(leftMenuBgColor)))
  }

  // 头部主题相关
  const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

  const setHeaderTheme = (color: string) => {
    const isDarkColor = colorIsDark(color)
    const textColor = isDarkColor ? '#fff' : 'inherit'
    const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
    const topToolBorderColor = isDarkColor ? color : '#eee'
    setCssVar('--top-header-bg-color', color)
    setCssVar('--top-header-text-color', textColor)
    setCssVar('--top-header-hover-color', textHoverColor)
    setCssVar('--top-tool-border-color', topToolBorderColor)
    appStore.setTheme({
      topHeaderBgColor: color,
      topHeaderTextColor: textColor,
      topHeaderHoverColor: textHoverColor,
      topToolBorderColor
    })
    if (unref(layout) === 'top') {
      setMenuTheme(color)
    }
  }

  const setMenuTheme = (color: string) => {
    const primaryColor = useCssVar('--el-color-primary', document.documentElement)
    const isDarkColor = colorIsDark(color)
    const theme: Recordable = {
      // 左侧菜单边框颜色
      leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
      // 左侧菜单背景颜色
      leftMenuBgColor: color,
      // 左侧菜单浅色背景颜色
      leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
      // 左侧菜单选中背景颜色
      leftMenuBgActiveColor: isDarkColor
        ? 'var(--el-color-primary)'
        : hexToRGB(unref(primaryColor), 0.1),
      // 左侧菜单收起选中背景颜色
      leftMenuCollapseBgActiveColor: isDarkColor
        ? 'var(--el-color-primary)'
        : hexToRGB(unref(primaryColor), 0.1),
      // 左侧菜单字体颜色
      leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
      // 左侧菜单选中字体颜色
      leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
      // logo字体颜色
      logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
      // logo边框颜色
      logoBorderColor: isDarkColor ? color : '#eee'
    }
    appStore.setTheme(theme)
    appStore.setCssVarTheme()
  }
  if (layout.value === 'top' && !appStore.getIsDark) {
    headerTheme.value = '#fff'
    setHeaderTheme('#fff')
  }

  return {
    setSystemTheme,
    setHeaderTheme,
    setMenuTheme
  }
}
