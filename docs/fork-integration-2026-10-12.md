# 2026-10-12 fork 优化融合记录

用户选择 A4（towersip 三网小曲线），要求默认关闭、其他优化由维护者挑选、分阶段 Git 存档并逐项致谢。本次范围为 M5 可选曲线、M2 缓存和刷新、M4 手机 / 图表布局、M3 浮窗文本转义、M6 文档与回归验证。随后追加 WebGL 回退、地理地址边界、手机提示手势、分组计数及保留期内长范围，版本升至 3.4.0。

## 三网原实现与设置追加移植

按用户对实际效果的复核，继续移植同一 towersip `a41270e460ee003e33f25091e8f3b3a950675662` 的 NodeCard 网格布局、useThreeNetPing 名称缩写 / 状态配色、manifest 设置和 ThemePingSettings 任务勾选 / 保存逻辑。

| 项目     | 3.4.0 的适配                                     | 本次移植                                                                                                          |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 曲线行   | 名称和延迟上下两行、28px 曲线、独立背景 / 内边距 | 下游共享 5 列：色点、缩写、延迟、16px 曲线、丢包；20px 行高 / 4px 行间距                                          |
| 卡片大小 | 自定义区域造成额外高度                           | 保留 compact 宽度和列数；浏览器实测三条曲线仅增高 24px；虚拟占位沿用下游行数公式                                  |
| 配色     | 所有曲线蓝色                                     | 延迟和丢包分别使用下游状态色；亮色文本加深绿色 / 黄绿色 / 黄色以保证可读性，保留色觉辅助                          |
| 历史信息 | 曲线下面新增文本块                               | 下游曲线上方浮窗，选点不改变卡片高度；保留主线手机轻点 / 滑动区分和键盘选点                                       |
| 设置     | 单开关、文本 ID、JSON 绑定、空值自动选线路       | 下游双开关、pingtasks、全局 / 服务器任务勾选；空选择恢复总览，旧 ID 格式仍可读取                                  |
| 编辑器   | 无                                               | 移植下游两栏编辑器；适配为首页 AppDialog，保持两个公开路由；手机缩短节点列表并固定保存按钮                        |
| 保存     | 无                                               | Service / RequestManager / API；验证管理员，使用当前主题名、JSON 编码，重新读取并合并配置，保留未编辑节点及无关项 |

同时修复 Ping 统计浮窗逆色标签、DataTooltip 被全局玻璃背景样式覆盖的问题、Tabs 非选中标签，以及 Ping 未选中任务 30% 整体透明度导致的信息不可读。未选中任务改为边框与“未显示”文字标记。

## 已融合与来源

| 来源快照                                                                                                                 | 移植 / 改写                                                                                                   | 主线落点和取舍                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [towersip a41270e](https://github.com/towersip/komari-theme-Glassmorphism/tree/a41270e460ee003e33f25091e8f3b3a950675662) | `Sparkline.vue`、`sparklinePath.ts`、`useSparklinePeriodInspect.ts`；参考 `useThreeNetPing.ts` 和任务绑定设置 | 新增 NodeThreeNetPing / useThreeNetPing，复用 useNodePingStats 每节点一次历史查询；SVG 保留空值、真实极值和直线段，避免曲线插值越界与削掉尖峰；手机改为抬手轻点才固定选点，8px 以上移动 / 长按 / pointercancel 不触发。支持键盘选点和安全的配置回退。 |
| [towersip 48d9587](https://github.com/towersip/komari-theme-Glassmorphism/commit/48d9587)                                | iOS 安全区布局思路                                                                                            | 主线 Header / Footer / BackTop / AppDialog 使用 env(safe-area-inset-\*)，弹窗同时修正不对称安全区中心；保留已有 viewport-fit=cover 和 reka-ui 模态焦点 / 滚动锁。                                                                                     |
| [thinkemm f45aa31](https://github.com/thinkemm/komari-theme-Glassmorphism/tree/f45aa317086aa10587b3f182170ec6eee1e15011) | 公共任务 TTL 缓存、`${key}:tasks` 取消、节点 Ping 状态传递                                                    | metrics.service 公共元数据缓存 5 分钟，仍走 RequestManager 去重；history.service 释放关联请求；nodes store 保留 typed ping 并在现有响应式对象上更新。                                                                                                 |
| [VoyagerProbe fa18256](https://github.com/VoyagerProbe/Glassmorphism-Plus/tree/fa182566bb1978f88d362fe0f7345d1a4b6f52bc) | `pingChartPresentation.ts` 的 escapePingTooltip / pingChartTaskLabels、`pingChartSmoothing.ts`                | PingChart 图例及颜色依任务 ID，重复名称加唯一后缀，HTML formatter 转义任务名；展示 EWMA 不改原始数据和统计，空值重置平滑，不再填补缺测；轴标签 hideOverlap。仅移植实际使用的 helpers。                                                                |
| 同上                                                                                                                     | 共享刷新调度及隐藏 / 离线暂停思路；窄屏头部布局                                                               | 新 visibleRefresh.service 单计时器、按订阅释放、隐藏 / 离线暂停、恢复立即刷新。HomeView KeepAlive 失活时释放曲线历史及任务订阅。Header 长标题省略，操作按钮不挤压；详情小屏头部三列、操作条另起一行，保留主线 Select / GPU 功能。                     |

三个来源 LICENSE 均为 MIT，并保留相同的 `Copyright (c) 2025 Tony Liu (tonyliuzj, tony-liu.com)`。本仓库 LICENSE 已含完整版权、许可及免责条款；README 致谢额外记录贡献者链接和移植范围。`public/THIRD-PARTY-NOTICES.txt` 将完整许可及来源信息随构建复制到 dist 和主题 ZIP。

## 设置与兼容性

- `threeNetPingEnabled=false`、`threeNetPingSparkline=false`：默认原双面板，不请求额外任务目录，不计算逐任务曲线。显示三网与新版曲线样式分别控制。
- `threeNetPingTaskIds="[]"`：空选择回退总览；全局及节点最多选择三个任务，显式 ID 顺序不随后台任务排序变化。兼容旧逗号 ID 配置。
- `threeNetPingNodeTaskBindings="{}"`：可选 UUID → 最多三个任务 ID，优先于全局；无效 JSON / UUID / ID 安全回退。没有适用任务显示提示，不编造线路。
- 最近一小时摘要历史保持最多 150 个后端采样点 / 最多 20 个显示时段；查看的是时段平均值，缺测不连线。统计摘要和最新实时状态不会伪造成带时间戳的历史。
- 最新探测负值显示不可达，丢包使用 NodeStatusPing 的百分数契约；Metric Store `ping.loss` 的比例只在历史显示处乘 100。
- 保留 public home / detail、后台权限服务、compact 默认、主题 ZIP 布局及文件名，未新增依赖、SW、后端插件或新路由。

## 第二阶段追加融合（v3.4.0）

| 来源快照                                                                                                                                     | 移植 / 改写                  | 主线取舍                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [pwremilk f826ecd](https://github.com/pwremilk/komari-theme-Glassmorphism-custom/tree/f826ecd956848d12082cff593f7194f7ed26a6ac)              | WebGL 能力探测               | 真实地球初始化失败、上下文丢失和 WebGL 不可用时均回退现有平铺地图；不强制用户切换设置。                            |
| [3560912451zz-stack 3aacbda](https://github.com/3560912451zz-stack/komari-theme-Glassmorphism/tree/3aacbda95671297e7b42c30b3a76d5e9d0bf5ea2) | 公网 IP 与异步地理结果过滤   | 完整校验 IPv4、IPv6、IPv4-mapped literal，拒绝保留 / 文档 / 链路本地地址与 0,0；查询代次变化或退出登录后丢弃结果。 |
| [casiuna 3bb76d9](https://github.com/casiuna/Glassmorphism-Enhanced/tree/3bb76d9fd6f86d9fe56845b12922ee75866f2ed3)                           | IPv6 地理回退                | 节点 IPv4 服务返回无效坐标后顺序尝试 IPv6；保留缓存、权限和国家级坐标兜底。                                        |
| [zfloong d6ccddbd](https://github.com/zfloong/komari-theme-Glassmorphism/tree/d6ccddbd4b619f83bdac2520bd22a3bf97f58100)                      | 7 / 15 / 30 天 Ping 快捷范围 | 只有后端保留期足够时显示，保留原 6 / 12 小时和自定义范围。                                                         |

第二阶段还把触屏轻点 / 滑动 / 长按判断改写为独立 composable，分组数量默认关闭并按可见节点、离线节点和多分组分别计数。没有合入大批量后端请求、三网中转估算、Worker / Service Worker、个人 API 或整套皮肤。

## 本轮保留为候选

其余候选仍在 [审查报告](fork-optimization-review-2026-10-12.md)。批量多节点请求涉及后端兼容与大规模压测；WebGL 降级需验证 WebGL2 / 上下文丢失；地理回退需要完整 IPv6 边界；周期流量 sum 需要后端指标定义。未为增加融合数量而导入整个 fork、不同皮肤、个人 API 或自定义后端插件。

## 阶段存档与验证

- `b90769f`：Issue #59 模态浮窗层级、指标图例 / 图标对齐，以及来源审查报告。
- `ecd3fc4`：公共任务缓存、关联取消、共享可见刷新及逐任务 / 实时状态基础。
- `da42c8e`：默认关闭的 A4、绑定 / 自动选择、历史点交互、图表文本转义与缺测正确性。
- `1b0cbf7`：手机安全区 / 窄屏布局与包内许可。
- 最后另存 README / 本融合记录 / 本任务 AICACHE 交接。包对应最后源码提交 1b0cbf7，后续只有文档提交；本地制作，不推送或发布。

最终 `bun run lint`、`bun run build`、`git diff --check` 均通过。聚焦 Playwright **13/13**（23 秒）覆盖默认双面板无额外目录请求、桌面 / 手机三网历史和实时更新、精确 ID 绑定、缺测断线、实际手机滑动 / 键盘选点、目录缓存复用、后台暂停恢复、图例真实位置与切换、模态浮窗遮挡，以及同名 / HTML 任务名边界。手机交互在 Chromium 验证，真机 Safari 尚未验证。

主题包：`komari-theme-Glassmorphism-build-1b0cbf7.zip`，版本 **3.3.8**，**7,600,938 bytes / 773 entries**，SHA-256 `61a2ceabc2e403c477e65d527c4be28821acef4a07770f171133436c5f49bfb0`。ZIP 顶层保持 `komari-theme.json` / `preview.png` / `dist/`；preview 与 docs/preview.png 一致、所有 dist 文件逐字节一致、包内有 MIT 许可、A4 默认 false / 卡片默认 compact。

截图：`test-results/three-net-desktop.png` / `three-net-mobile.png`、`chart-legends-*.png`、`ping-tooltip-*.png`（本地验证产物，不提交到源码）。构建只报告既有 VueUse PURE 注释与 globe 大块体积提示。

## v3.4.1 发布与追加验证

阶段提交 `7c0419c`、`f37641d`、`0b1d9b7` 已推送，完成上表的三网展示、设置及对比度移植。[v3.4.1](https://github.com/sanrokamlan-prog/komari-theme-Glassmorphism/releases/tag/v3.4.1) 指向 `0b1d9b75508f68a5501c443b4eaae405acc7e334`，公开主题包 SHA-256 为 `bf2ceb4afce12d2bdfb615221e4dcff4bf23bc15649a719c972ee41184836e75`；包内版本、默认开关、布局及许可均已核对。

lint / build 通过，本地完整回归 42/42。远端首次视觉回归的四个失败来自测试读取旧版 vue-echarts ref 结构；在实际下载的发布包复现后，测试兼容 8.0.2 暴露的解包实例，发布包完整回归再次 42/42（57.7 秒）。运行时代码和已发布主题包无需修改。

测试修复提交 `4ab659f` 的 [Visual Regression](https://github.com/sanrokamlan-prog/komari-theme-Glassmorphism/actions/runs/38249323286)、[Code Quality](https://github.com/sanrokamlan-prog/komari-theme-Glassmorphism/actions/runs/38249323330) 均已成功。
