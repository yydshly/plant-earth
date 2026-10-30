# 全球地区课程：配音、字幕与证据

本包为新增的地区学习入口提供 **85 个地区课程和 1 个全球导览，共 86 章**。全部使用真实 MiniMax `speech-2.8-hd`、温润男声、0.95 语速生成；原 351 章课程及其文件未修改。

最终活动脚本有 30,715 个字符，活动音频总长 **7,036.020 秒，约 117 分 16 秒**，617 个提供商句段。每章分成气候、土壤、实际水源三个教学片段，共 258 个时间锚点。原始 MP3 为 32 kHz、单声道、名义 128 kbps，活动文件约 107.5 MiB。

## 讲解组织

每个地区先定位，再把实际气候数值、根区条件和供水机制连起来。正文不是给相同模板更换地名：新增 60 地区分别讨论季风雨季与生育期错位、凉季与暖季作物、南北半球季节、山地与低地、干夏灌溉、三角洲盐度与排水、浅根与深根、酸碱与养分、附生基质等问题。`case-notes.json` 保存这 60 个地区的三个机制说明；已同步到地区数据卡。

同一章仅选择若干代表植物解释机制，`cropIds` 是地区关联，不声称黄点有这些植株。农业国家统计只说明国家生产背景；缺少匹配商品记录的植物保留机制对照。图卡按关系类型分别显示。气候曲线为 NASA POWER/MERRA-2 2001–2025 格点；土壤是 SoilGrids 250 m、0–5 cm 预测；水面频率为 JRC 1984–2024 像元。它们既不同尺度，也不等于植物根旁的全部实测。

`spokenFacts` 保存实际被朗读的标量及来源单位。语音中的温度四舍五入到整摄氏度，日降水率和土壤 pH 到一位小数，质地和水面百分比到整数；图卡保留来源完整数值。旁白没有把年平均温度当作霜冻日期，也没有把 pH 当成盐度、表土当成整个根层、水面频率当成水深或灌溉量。

## 播放格式

`segments.json` 的每章有 `id/classId/regionId/cropId/cropIds/title/text/textHash/beats/explanations/sources/spokenFacts/evidenceFingerprint`。每个 beat 的 `lessonStep` 为 0、1、2；`action` 提供实际 `regionId/cropId/evidence/lon/lat`。`classId` 对应地区 ID，总览为 `regional-overview`。总览三幕定位纳米布、阿尔卑斯、托马莱斯湾三个有真实证据的地区，不计作第 86 个地区。

公开 `audio/manifest.json` 每条只有 `id/classId/regionId/cropId/file/duration/cues/textHash`。字幕使用提供商句子时间；句子内部的界面切换按字符比例估计，未声称逐词强制对齐。

提供商曾在三段中文的句子间删去显示空格。本包保留原始返回，只有在去空白后逐字、标点与数字完全相同时，才恢复冻结稿的显示空白并重建字符坐标。句子起止时间与词语均不改变；`verification.json` 的 `displayWhitespaceRestorations` 逐条记录这种修复。未因此重新请求合成。

德国课程的初版有一处易混淆的“北欧凉爽”措辞。最终活动版改为“当地较凉”，另用 `region-course-germany-saxony-v2` 重新生成；旧 v1 文件与原稿保留为归档，不在活动清单中。`revision-germany-v2.json` 说明修订范围。两条失效来源链接仅作元数据修复，记录在 `metadata-source-repairs.json`，未改变正文或声音。

## 本地核验

```powershell
python generate_audio.py --validate-only
python verify_generator.py
python verify_audio.py
node verify_clock.mjs
```

最终 `verify_audio.py` 通过 **4,503 项断言**，核对全部 86 个 MP3 的真实文件、ffprobe 时长与格式、字幕原始响应、冻结文字哈希、332 个被讲述的真实地区数值、每幕坐标与植物关联。时钟检查通过 258 个幕间锚点与 86 个终点。生成器另通过 15 项恢复、缓存与不盲目付费重试检查。

最终证据包 SHA256 为 `9aa46a4eeb26d7b6a81ce64ec54ebdba2e74f1bdc89312b3152c57c9d9e25c38`；最终脚本 SHA256 为 `7f54deffdaace01e6d691b52737efd2f765905e7055cc91a57f2e80e59aa5753`。构建时应检查 `verification.json` 为 passed、complete，并与这两个实际文件哈希相符。

## 生成与恢复

`generate_audio.py --ids <明确章节ID>` 才产生新付费请求；不传 ID 不会批量合成。已完成文件优先复用，已有失败尝试不会自动重新付费；有保存的 MP3 和原始响应时使用 `--recover <ID>` 恢复。生成凭据只从项目授权的 `.env.minimax` 在进程中读取，终端和公开清单不输出密钥。

`audio/progress.json`、`*.response-receipt.json` 等属于本地生成记录，可能含提供商 trace 或带签名的字幕地址，不应随网页公开。页面只需要活动 MP3、经过白名单筛选的 manifest、冻结课程脚本和验证摘要。
