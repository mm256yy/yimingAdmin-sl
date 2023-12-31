import { ElSubMenu, ElMenuItem } from 'element-plus'
import type { RouteMeta } from 'vue-router'
import { hasOneShowingChild } from '../helper'
import { isUrl } from '@/utils/is'
import { useRenderMenuTitle } from './useRenderMenuTitle'
import { useRenderDropMenuTitle } from './useRenderDropMenuTitle'
import { useDesign } from '@/hooks/web/useDesign'
import { pathResolve } from '@/utils/routerHelper'
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue'

export const useRenderMenuItem = (
  // allRouters: AppRouteRecordRaw[] = [],
  menuMode: 'vertical' | 'horizontal'
) => {
  const appStore = useAppStore()
  const layout = computed(() => appStore.getLayout)

  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = '/', sub?: boolean) => {
    return routers.map((v) => {
      const meta = (v.meta ?? {}) as RouteMeta
      if (!meta.hidden) {
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
        const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // getAllParentPath<AppRouteRecordRaw>(allRouters, v.path).join('/')

        const { renderMenuTitle } = useRenderMenuTitle()
        const { renderDropMenuTitle } = useRenderDropMenuTitle()

        if (
          oneShowingChild &&
          (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
          !meta?.alwaysShow
        ) {
          return (
            <ElMenuItem index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
              {{
                default: () =>
                  sub && layout.value === 'top'
                    ? renderDropMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
                    : renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
              }}
            </ElMenuItem>
          )
        } else {
          const { getPrefixCls } = useDesign()

          const preFixCls = getPrefixCls('menu-popper')
          return (
            <ElSubMenu
              index={fullPath}
              popperClass={
                menuMode === 'vertical' ? `${preFixCls}--vertical` : `${preFixCls}--horizontal`
              }
            >
              {{
                title: () => renderMenuTitle(meta),
                default: () => renderMenuItem(v.children!, fullPath, true)
              }}
            </ElSubMenu>
          )
        }
      }
    })
  }

  return {
    renderMenuItem
  }
}
