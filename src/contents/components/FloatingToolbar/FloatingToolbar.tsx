/**
 * 浮动工具栏组件
 */

import React, { useEffect, useRef, useState } from "react";
import { HelpCircle, CreditCard, BookOpen, MoreVertical, PanelRight } from "lucide-react";
import type { ToolbarPosition } from "./types";
import { generateQuestion } from "./api";

interface FloatingToolbarProps {
  position: ToolbarPosition;
  selection: string;
  onClose?: () => void;
}

export function FloatingToolbar({ position, selection, onClose }: FloatingToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        moreButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const finalStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: "translate(-50%, 0)",
  };

  const handleGenerateQuestion = async () => {
    if (loading || !selection.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const question = await generateQuestion({
        text: selection,
        difficulty: "medium",
        questionCount: 1
      });

      console.log("✅ 问题生成成功:", question);
      // TODO: 显示成功提示
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "生成问题失败";
      setError(errorMessage);
      console.error("❌ 生成问题失败:", errorMessage);
      // TODO: 显示错误提示

      // 3秒后清除错误
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = () => {
    // TODO: 实现生成卡片功能
    console.log("生成卡片:", selection);
    onClose?.();
  };

  const handleGenerateGlossary = () => {
    // TODO: 实现生成术语功能
    console.log("生成术语:", selection);
    onClose?.();
  };

  const handleToggleSidebar = () => {
    // TODO: 实现切换侧边栏功能
    console.log("切换侧边栏");
  };

  const handleMoreClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        zIndex: 999999,
        ...finalStyle
      }}
    >
      {/* 内层 div 处理动画 */}
      <div style={{
        animation: "fadeIn 0.2s ease-out"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          backdropFilter: "blur(4px)",
          borderRadius: "9999px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: error ? "1px solid rgba(239, 68, 68, 0.8)" : "1px solid rgba(55, 65, 81, 0.5)"
        }}>
          {/* 错误提示 */}
          {error && (
            <div style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.9)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 1000000
            }}>
              {error}
            </div>
          )}

          {/* 生成问题 */}
          <button
            onClick={handleGenerateQuestion}
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "9999px 0 0 9999px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.15s",
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)")}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            title="生成问题"
            aria-label="生成问题"
          >
            {loading ? (
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid #d1d5db",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
            ) : (
              <HelpCircle style={{
                width: "20px",
                height: "20px",
                color: "#d1d5db"
              }} />
            )}
          </button>

          <div style={{
            width: "1px",
            height: "24px",
            backgroundColor: "rgba(55, 65, 81, 0.5)"
          }} />

          {/* 生成卡片 */}
          <button
            onClick={handleGenerateCard}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.15s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            title="生成卡片"
            aria-label="生成卡片"
          >
            <CreditCard style={{
              width: "20px",
              height: "20px",
              color: "#d1d5db"
            }} />
          </button>

          <div style={{
            width: "1px",
            height: "24px",
            backgroundColor: "rgba(55, 65, 81, 0.5)"
          }} />

          {/* 生成术语 */}
          <button
            onClick={handleGenerateGlossary}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.15s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            title="生成术语"
            aria-label="生成术语"
          >
            <BookOpen style={{
              width: "20px",
              height: "20px",
              color: "#d1d5db"
            }} />
          </button>

          <div style={{
            width: "1px",
            height: "24px",
            backgroundColor: "rgba(55, 65, 81, 0.5)"
          }} />

          {/* 更多 */}
          <div style={{ position: "relative" }}>
            <button
              ref={moreButtonRef}
              onClick={handleMoreClick}
              style={{
                padding: "10px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              title="更多选项"
              aria-label="更多选项"
            >
              <MoreVertical style={{
                width: "20px",
                height: "20px",
                color: "#d1d5db"
              }} />
            </button>

            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  marginTop: "8px",
                  right: 0,
                  width: "192px",
                  backgroundColor: "rgba(17, 24, 39, 0.95)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "8px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  border: "1px solid rgba(55, 65, 81, 0.5)",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  animation: "fadeIn 0.2s ease-out",
                  zIndex: 999999
                }}
              >
                <button
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "#d1d5db",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#d1d5db";
                  }}
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  保存笔记
                </button>
                <button
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "#d1d5db",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#d1d5db";
                  }}
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  分享
                </button>
                <div style={{
                  height: "1px",
                  backgroundColor: "rgba(55, 65, 81, 0.5)",
                  marginTop: "4px",
                  marginBottom: "4px"
                }} />
                <button
                  style={{
                    width: "100%",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    color: "#d1d5db",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.5)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#d1d5db";
                  }}
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  设置
                </button>
              </div>
            )}
          </div>

          <div style={{
            width: "1px",
            height: "24px",
            backgroundColor: "rgba(55, 65, 81, 0.5)"
          }} />

          {/* 侧边栏 */}
          <button
            onClick={handleToggleSidebar}
            style={{
              padding: "10px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0 9999px 9999px 0",
              cursor: "pointer",
              transition: "background-color 0.15s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(147, 51, 234, 0.5)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            title="展开侧边栏"
            aria-label="展开侧边栏"
          >
            <PanelRight style={{
              width: "20px",
              height: "20px",
              color: "#c084fc"
            }} />
          </button>
        </div>
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
