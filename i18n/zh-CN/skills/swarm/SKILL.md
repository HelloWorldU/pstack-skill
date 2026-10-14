---
name: swarm
description: "扇出 N 个并行 worker，等它们全部完成，返回一份汇总报告。适用于 /swarm、「swarm 一下这个」，或并行覆盖、竞赛、连番考验和探索。"
disable-model-invocation: true
---

# Swarm（蜂群）

扇出 N 个并行云端 worker。它们可以各自覆盖不同的切片，可以就同一份任务简报竞赛，也可以两者混合。父代理等待、聚合，并返回一份报告。

## 开始

在启动任何东西之前，先建一个待办清单，每个阶段一条。

1. 界定（Frame）
2. 扇出（Fan out）
3. 聚合（Aggregate）
4. 报告（Report）

## A 阶段：界定

1. 说明完成谓词，以及蜂群必须返回的产物或报告。
2. 选择形态。把任务切成若干切片、让 N 个 worker 就相同的简报竞赛，或两者混合。对于竞赛或混合形态，在派生之前声明 `first pass`、`rank all` 或 `best-of`。
3. N 由用户给出，或根据形态推导。N 是 worker 总数，不是云端并发上限。
4. 从 `~/.cursor/rules/pstack-models.mdc` 的 `swarm workers` 一行选取 worker 模型。如果该规则或该行缺失，使用 `grok-4.7-xhigh-fast`。如果是 `auto` 或 `inherit-parent`，则不设置 `model`，让 worker 用父代理的模型运行。如果 Task 工具拒绝某个 slug，使用默认值并说明。如果连默认值也被拒绝，从它的报错信息里选一个同家族最接近的有效 slug。对于模型竞赛，提前点名每一臂的模型。按照 **poteto-mode** 技能的 Subagents 一节，为每个子代理挑选适合任务的推理等级和快速或标准速度。
5. worker 要写文件时，给每个 worker 自己可写的输出位置。当 worker 验证或测量某些提交时，每份简报要点名确切的 SHA。测量类简报还要说明方法（样本数、一个样本是什么、顺序）。worker 把两者都记进它的结果里。

## B 阶段：扇出

在一条消息里派生全部 N 个 worker，参数为 `subagent_type: generalPurpose`、`environment: "cloud"`、`run_in_background: true`，模型用第 4 步选定的；`auto` 或 `inherit-parent` 则不设置。仅当 worker 需要访问用户电脑上的东西时才用 `environment: "local"`。

当 worker 必须从一个非默认的、已推送的分支开始时，传 `cloud_base_branch`。

每份简报都要独立完整。包含目标、范围、确切的切片或竞赛臂、如何验证、报告什么。报告使用 `PASS`、`ISSUES` 或 `BLOCKED` 并附证据。能证明某个缺陷的 worker 报告 `ISSUES`，并列出它能证明的每一个问题，而不只是第一个。

如果有 worker 掉队，按 N-1 继续，并注明。

## C 阶段：聚合

读取最终结果。凡是没有记录其简报点名的 SHA 和方法的结果，丢弃并重新派生该 worker 一次。第二次仍然缺失的，记为一个缺口。缺口不算通过。覆盖类任务中，每个必需的切片都要有结果。竞赛类任务中，应用提前声明的选择规则：first pass、rank all 或 best-of。不要粘贴 worker 的原始输出。

保留一张紧凑的结果表、一行一个且带证据的问题，以及明确的缺口或掉队记录。

## D 阶段：报告

返回一份汇总后的聊天内报告，包含表格、一句话问题描述、缺口或掉队情况，以及使用的竞赛规则（如有）。
