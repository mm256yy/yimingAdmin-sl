<script lang="tsx">
import { computed, defineComponent, unref, PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItemWork'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      // const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      return 'horizontal'
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      console.log(index)

      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          class="user-menu"
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={false}
          ellipsis={false}
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="transparent"
          textColor="#fff"
          activeTextColor="#fff"
          onSelect={menuSelect}
          menu-trigger="hover"
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem()
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => <ElScrollbar class="work-scrollbar">{renderMenu()}</ElScrollbar>
  }
})
</script>

<style lang="less" scoped>
:deep(.el-popper) {
  margin-left: -52px;
}
.@{elNamespace}-menu {
  margin-top: 12px;
  border-bottom: 0 none;

  .@{elNamespace}-menu-item {
    height: 40px;
    padding: 0;
    font-size: 16px;

    &:hover {
      background-color: transparent;
    }

    &.is-active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
  .@{elNamespace}-sub-menu {
    :deep(.@{elNamespace}-sub-menu__title) {
      height: 40px;
      padding: 0 !important;
      font-size: 16px;
    }
    :deep(.@{elNamespace}-sub-menu__icon-arrow) {
      display: none;
    }

    &.is-active {
      :deep(.@{elNamespace}-sub-menu__title) {
        color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
}
</style>

<style lang="less">
.drop-menu {
  margin-left: -52px !important;
  border-radius: 4px !important;

  .drop-menu {
    margin-left: 0 !important;
  }

  .el-menu {
    .el-menu-item {
      height: 48px !important;
      padding: 0 36px !important;
      font-size: 16px !important;
      color: #131313 !important;

      &:hover {
        color: var(--el-color-primary) !important;
        background-color: transparent !important;
      }

      &.is-active {
        color: var(--el-color-primary) !important;
        background-color: transparent !important;
        border: 0 none !important;

        &:after {
          display: none !important;
        }
      }
    }
  }
}

.user-menu {
  .without-outline:focus {
    outline: none;
  }

  .el-menu-item:not(.is-disabled):focus {
    background-color: transparent !important;
  }
}

.work-scrollbar {
  .el-scrollbar__view {
    overflow: hidden;
  }
}
</style>
