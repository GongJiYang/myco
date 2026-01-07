# Floating Toolbar Component

浮选中文本时显示的工具栏组件。

## 文件结构

```
FloatingToolbar/
├── index.ts                          # 模块导出
├── FloatingToolbar.tsx               # 主组件
├── types.ts                          # TypeScript 类型定义
├── hooks/
│   ├── useToolbarPosition.ts         # 位置计算 Hook
│   └── useTextSelection.ts          # 文本选择监听 Hook
└── README.md                         # 文档
```

## 使用方法

### 在 Content Script 中使用

```tsx
import { FloatingToolbar } from './components/FloatingToolbar';
import { useToolbarPosition } from './components/FloatingToolbar/hooks/useToolbarPosition';
import { useTextSelection } from './components/FloatingToolbar/hooks/useTextSelection';

function MyComponent() {
  const { position, setPosition, calculatePosition } = useToolbarPosition();
  const { selection, selectionRect, hasSelection } = useTextSelection();

  useEffect(() => {
    if (selectionRect && hasSelection) {
      const newPosition = calculatePosition(selectionRect);
      setPosition(newPosition);
    }
  }, [selectionRect, hasSelection, calculatePosition, setPosition]);

  return (
    <>
      {hasSelection && (
        <FloatingToolbar
          position={position}
          onClose={() => console.log('close')}
        />
      )}
    </>
  );
}
```

## 功能特性

- ✅ 自动检测文本选择
- ✅ 智能定位（自动调整边界）
- ✅ 纯内联样式（无 CSS 依赖）
- ✅ 动画过渡效果
- ✅ 点击外部关闭
- ✅ 下拉菜单

## API

### FloatingToolbar Props

| Prop | Type | Description |
|------|------|-------------|
| `position` | `{ x: number, y: number }` | 工具栏位置 |
| `onClose` | `() => void` | 关闭回调 |

### useToolbarPosition

```tsx
const { position, setPosition, calculatePosition } = useToolbarPosition({
  toolbarWidth: 280,    // 可选
  toolbarHeight: 50,    // 可选
  offset: 10            // 可选
});
```

### useTextSelection

```tsx
const { selection, selectionRect, hasSelection } = useTextSelection();
```

## 样式自定义

组件使用内联样式，可以直接修改 `FloatingToolbar.tsx` 中的样式对象。

## 待实现功能

- [ ] 生成问题
- [ ] 生成卡片
- [ ] 生成术语
- [ ] 切换侧边栏
- [ ] 保存笔记
- [ ] 分享功能
