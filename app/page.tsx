"use client";

import { Copy, Dice5, Loader2, Pencil, RotateCcw, Save, Share2, Sparkles, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const labels = {
  space: "\u7a7a\u95f4",
  style: "\u98ce\u683c",
  mood: "\u6c1b\u56f4",
  lighting: "\u5149\u5f71\u73af\u5883",
  lightingSoft: "\u81ea\u7136\u67d4\u5149",
  lightingGolden: "\u508d\u665a\u9ec4\u660f",
  palette: "\u914d\u8272",
  materials: "\u6750\u8d28\u7ec6\u8282",
  budget: "\u9884\u7b97\u5b9a\u4f4d",
  engine: "\u6e32\u67d3\u5f15\u64ce",
  scheme: "\u65b9\u6848\u7c7b\u578b",
  detail: "\u5173\u952e\u7ec6\u8282",
  keywords: "\u5173\u952e\u8bcd",
  generatedPrompt: "\u53ef\u590d\u5236\u63d0\u793a\u8bcd",
  englishPrompt: "\u82f1\u6587\u4e3b\u63d0\u793a\u8bcd",
  chinesePrompt: "\u4e2d\u6587\u63d0\u793a\u8bcd",
  negativePrompt: "\u53cd\u5411\u63d0\u793a\u8bcd",
  aiOptimizeEnglish: "AI \u4f18\u5316\u82f1\u6587",
  aiOptimizeChinese: "AI \u4f18\u5316\u4e2d\u6587",
  syncing: "\u540c\u6b65\u4e2d",
  promptPlaceholder: "\u9009\u62e9\u5de6\u4fa7\u53c2\u6570\uff0c\u8fd9\u91cc\u4f1a\u751f\u6210\u53ef\u76f4\u63a5\u7528\u4e8e\u56fe\u50cf\u6a21\u578b\u7684\u63d0\u793a\u8bcd\u3002",
  detailPlaceholder:
    "\u4f8b\uff1a\u4fdd\u7559\u539f\u59cb\u5899\u4f53\u4f4d\u7f6e\u3001\u9876\u9762\u6881\u4f53\u3001\u53f3\u4fa7\u5e73\u53f0\u3001\u5de6\u4fa7\u5361\u5ea7\u533a\u57df",
  keywordPlaceholder:
    "\u4f8b\uff1a\u4e1c\u65b9\u7985\u610f\u3001\u6df1\u8272\u5b9e\u6728\u3001\u4f4e\u7167\u5ea6\u6696\u5149\u3001\u77f3\u6750\u5899\u9762",
  randomize: "\u968f\u673a\u751f\u6210",
  reset: "\u91cd\u7f6e",
  share: "\u5206\u4eab",
  recharge: "\u5145\u503c",
  editContent: "\u7f16\u8f91\u5185\u5bb9",
  contentEditorTitle: "\u5185\u5bb9\u7f16\u8f91",
  contentEditorSubtitle: "\u5728\u8fd9\u91cc\u4fee\u6539\u9875\u9762\u6838\u5fc3\u6587\u6848\uff0c\u4fdd\u5b58\u540e\u4ec5\u5728\u5f53\u524d\u6d4f\u89c8\u5668\u751f\u6548\u3002",
  brandSubtitle: "\u54c1\u724c\u526f\u6807\u9898",
  saveContent: "\u4fdd\u5b58\u5185\u5bb9",
  resetContent: "\u6062\u590d\u9ed8\u8ba4",
  contentSaved: "\u5df2\u4fdd\u5b58",
  closeEditor: "\u5173\u95ed\u7f16\u8f91\u5668",
  linkCopied: "\u94fe\u63a5\u5df2\u590d\u5236",
  generating: "\u751f\u6210\u4e2d",
  copy: "\u590d\u5236",
  copied: "\u5df2\u590d\u5236",
  saveKey: "\u4fdd\u5b58 Key",
  keySaved: "\u5df2\u4fdd\u5b58\uff0c\u53ef\u518d\u6b21\u4f18\u5316",
  rechargeTitle: "\u5145\u503c\u4e2d\u5fc3",
  rechargeSubtitle:
    "\u9009\u62e9\u5957\u9910\u540e\uff0c\u4f7f\u7528\u652f\u4ed8\u5b9d\u6216\u5fae\u4fe1\u626b\u7801\u4ed8\u6b3e\u3002\u4ed8\u6b3e\u540e\u590d\u5236\u4e0b\u65b9\u5145\u503c\u4fe1\u606f\u53d1\u7ed9\u5ba2\u670d\u6838\u5bf9\u3002",
  manualPayTitle: "\u626b\u7801\u652f\u4ed8",
  customerId: "\u5ba2\u6237\u7f16\u53f7",
  paymentRemark: "\u4ed8\u6b3e\u5907\u6ce8",
  alipay: "\u652f\u4ed8\u5b9d",
  wechatPay: "\u5fae\u4fe1\u652f\u4ed8",
  copyOrder: "\u590d\u5236\u5145\u503c\u4fe1\u606f",
  orderCopied: "\u5145\u503c\u4fe1\u606f\u5df2\u590d\u5236",
  manualPayNote:
    "\u8bf7\u6309\u5f53\u524d\u9009\u4e2d\u5957\u9910\u91d1\u989d\u4ed8\u6b3e\u3002\u6838\u5bf9\u5230\u8d26\u540e\uff0c\u4f1a\u4e3a\u5bf9\u5e94\u5ba2\u6237\u7f16\u53f7\u589e\u52a0 AI \u4f18\u5316\u6b21\u6570\u3002",
};

const spaces = ["\u5ba2\u5385", "\u5367\u5ba4", "\u53a8\u623f", "\u9910\u5385", "\u4e66\u623f", "\u6d74\u5ba4", "\u7384\u5173"];
const styles = ["\u73b0\u4ee3\u6781\u7b80", "\u4f98\u5bc2\u98ce", "\u5976\u6cb9\u98ce", "\u4e2d\u53e4\u73b0\u4ee3", "\u5317\u6b27\u81ea\u7136", "\u8f7b\u5962\u9152\u5e97", "\u5de5\u4e1a loft"];
const moods = ["\u5b89\u9759\u9ad8\u7ea7", "\u660e\u4eae\u901a\u900f", "\u6e29\u6696\u677e\u5f1b", "\u620f\u5267\u5316\u5149\u5f71", "\u6e05\u723d\u514b\u5236", "\u827a\u672f\u611f\u5f3a"];
const palettes = ["\u7c73\u767d + \u80e1\u6843\u6728 + \u9ed1\u8272", "\u9f20\u5c3e\u8349\u7eff + \u77f3\u6750\u7070", "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb", "\u70ad\u9ed1 + \u9ec4\u94dc + \u6df1\u6728\u8272", "\u9676\u571f\u8272 + \u5976\u6cb9\u767d"];
const materials = ["\u5929\u7136\u6728\u76ae", "\u5fae\u6c34\u6ce5", "\u6d1e\u77f3", "\u4e9a\u9ebb\u7ec7\u7269", "\u62c9\u4e1d\u91d1\u5c5e", "\u85e4\u7f16", "\u78e8\u7802\u73bb\u7483"];
const budgets = ["\u7ecf\u6d4e\u9884\u7b97", "\u4e2d\u7b49\u9884\u7b97", "\u4e2d\u9ad8\u9884\u7b97", "\u9ad8\u7aef\u5b9a\u5236"];
const cameras = ["wide-angle editorial photography", "35mm interior photography", "architectural digest style", "straight-on balanced composition"];
const engines = ["Octane Render", "Unreal Engine 5", "V-Ray"];
const rechargePlans = [
  { name: "\u4f53\u9a8c\u5305", price: "\u00a59", credits: "100 \u6b21 AI \u4f18\u5316" },
  { name: "\u6807\u51c6\u5305", price: "\u00a529", credits: "500 \u6b21 AI \u4f18\u5316" },
  { name: "\u4e13\u4e1a\u5305", price: "\u00a599", credits: "2500 \u6b21 AI \u4f18\u5316" },
];

const promptSchemes = [
  {
    id: "raw-shell",
    name: "\u6bdb\u576f\u751f\u56fe",
    note: "\u4fdd\u7559\u7a7a\u95f4\u7ed3\u6784\u5e76\u751f\u6210\u5b9e\u666f\u6548\u679c",
    enGuide:
      "Preserve the reference space structure and camera angle, keep original wall positions, ceiling beams, spatial perspective, floor level changes, side platforms, seating zones, and overall composition unchanged. Transform the rough space into a refined interior scene with coherent spatial hierarchy and realistic construction logic.",
    zhGuide:
      "\u53c2\u8003\u56fe\u7684\u7a7a\u95f4\u7ed3\u6784\u548c\u62cd\u6444\u89d2\u5ea6\uff0c\u4fdd\u6301\u539f\u59cb\u5899\u4f53\u4f4d\u7f6e\u3001\u9876\u9762\u6881\u4f53\u3001\u7a7a\u95f4\u900f\u89c6\u3001\u5730\u9762\u9ad8\u4f4e\u5dee\u3001\u5e73\u53f0\u3001\u5361\u5ea7\u533a\u57df\u548c\u6574\u4f53\u6784\u56fe\u4e0d\u53d8\uff0c\u5c06\u6bdb\u576f\u7a7a\u95f4\u6539\u9020\u6210\u9ad8\u7ea7\u5ba4\u5185\u6548\u679c\u3002",
    negativeZh:
      "\u6539\u53d8\u539f\u59cb\u7a7a\u95f4\u7ed3\u6784\uff0c\u5899\u4f53\u79fb\u4f4d\uff0c\u9876\u9762\u6881\u4f53\u4e22\u5931\uff0c\u7a7a\u95f4\u6bd4\u4f8b\u9519\u4e71\uff0c\u4eba\u7269\uff0c\u8fc7\u5ea6\u88c5\u9970\uff0c\u5ec9\u4ef7\u6750\u8d28\uff0c\u5851\u6599\u611f\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c\u6c34\u5370\u3002",
    negativeEn:
      "changed original structure, moved walls, missing ceiling beams, incorrect spatial proportions, people, overdecorated styling, cheap materials, plastic texture, low resolution, watermark",
  },
  {
    id: "su-line",
    name: "SU\u7ebf\u7a3f\u6e32\u67d3",
    note: "\u8f6f\u88c5\u6307\u5357\u677f\u548c\u4ea7\u54c1\u76ee\u5f55\u6392\u7248",
    enGuide:
      "Create a professional interior soft styling guide board, product catalog layout, and mood board. Use a clean white background with a grid system, display individual furniture pieces, material swatches, lamps, decor objects, rugs, tables, chairs, and storage items, then blend them into an elegant magazine-style presentation.",
    zhGuide:
      "\u4e13\u4e1a\u5ba4\u5185\u8bbe\u8ba1\u8f6f\u88c5\u642d\u914d\u6307\u5357\u5c55\u793a\u677f\uff0c\u4ea7\u54c1\u76ee\u5f55\u6392\u7248\u548c\u60c5\u7eea\u677f\uff0c\u5728\u7eaf\u51c0\u767d\u5e95\u4e0a\u4ee5\u7f51\u683c\u5f62\u5f0f\u5c55\u793a\u5bb6\u5177\u5355\u54c1\u3001\u6750\u8d28\u8272\u5757\u3001\u706f\u5177\u3001\u88c5\u9970\u54c1\u548c\u8f6f\u88c5\u642d\u914d\u5173\u7cfb\u3002",
    negativeZh:
      "\u5927\u7406\u77f3\u6ee5\u7528\uff0c\u5ec9\u4ef7\u6750\u8d28\uff0c\u8fc7\u5ea6\u66dd\u5149\uff0c\u6392\u7248\u6742\u4e71\uff0c\u7269\u4f53\u53d8\u5f62\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c\u5361\u901a\u611f\uff0c\u63d2\u753b\u611f\uff0c\u989c\u8272\u8fc7\u9971\u548c\uff0c\u6587\u5b57\u4e71\u7801\u3002",
    negativeEn:
      "overused marble, cheap materials, overexposure, chaotic catalog layout, object deformation, low resolution, cartoon style, illustration style, oversaturated colors, garbled text",
  },
  {
    id: "axonometric",
    name: "\u8f74\u6d4b\u56fe",
    note: "\u5efa\u7b51\u7a7a\u95f4\u7206\u70b8\u56fe\u89e3\u6790",
    enGuide:
      "Create a professional interior architectural exploded axonometric diagram with an isometric view. Decompose the space vertically into floating layers, show ceiling, background wall, furniture groups, flooring, material modules, guide lines, labels, and a clean infographic composition.",
    zhGuide:
      "\u4e00\u5f20\u4e13\u4e1a\u5ba4\u5185\u5efa\u7b51\u7a7a\u95f4\u7206\u70b8\u56fe\u89e3\u6790\uff0c\u7b49\u8ddd\u89c6\u89d2\u8f74\u6d4b\u56fe\uff0c\u5c06\u7a7a\u95f4\u5782\u76f4\u5206\u89e3\u4e3a\u60ac\u6d6e\u5c42\u7ea7\uff0c\u5c55\u793a\u9876\u9762\u3001\u80cc\u666f\u5899\u3001\u5bb6\u5177\u7ec4\u5408\u3001\u5730\u9762\u7ed3\u6784\u3001\u6750\u8d28\u8272\u5757\u548c\u6307\u793a\u5f15\u7ebf\u3002",
    negativeZh:
      "\u89c6\u89d2\u6df7\u4e71\uff0c\u900f\u89c6\u9519\u8bef\uff0c\u5c42\u7ea7\u4e0d\u6e05\uff0c\u6307\u793a\u7ebf\u6742\u4e71\uff0c\u5bb6\u5177\u53d8\u5f62\uff0c\u989c\u8272\u8fc7\u9971\u548c\uff0c\u5361\u901a\u611f\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c\u6587\u5b57\u4e71\u7801\u3002",
    negativeEn:
      "confusing camera angle, incorrect perspective, unclear layers, messy guide lines, deformed furniture, oversaturated colors, cartoon style, low resolution, garbled text",
  },
  {
    id: "plan-to-render",
    name: "\u5e73\u9762\u53d8\u6548\u679c\u56fe",
    note: "\u4ece\u5e73\u9762\u6216\u4f4e\u533a\u89c6\u89d2\u751f\u6210\u7167\u7247\u7ea7\u6548\u679c",
    enGuide:
      "Generate a high-quality photorealistic interior rendering from a plan or low-area perspective. The camera looks from the main zone toward an elevated rear seating or feature area, clearly showing foreground, middle ground, stair or platform transitions, furniture, wall finishes, lighting fixtures, and cinematic daylight.",
    zhGuide:
      "\u4e00\u5f20\u9ad8\u8d28\u91cf\u7167\u7247\u7ea7\u5ba4\u5185\u6e32\u67d3\uff0c\u89c6\u89d2\u4ece\u4e3b\u5ba2\u533a\u6216\u4f4e\u533a\u770b\u5411\u62ac\u9ad8\u7684\u540e\u533a\u5361\u5ea7\u6216\u529f\u80fd\u533a\uff0c\u6e05\u6670\u5c55\u793a\u524d\u666f\u3001\u4e2d\u666f\u3001\u53f0\u9636\u8f6c\u6362\u3001\u5bb6\u5177\u3001\u5899\u9762\u6750\u8d28\u3001\u706f\u5177\u548c\u7535\u5f71\u7ea7\u5149\u5f71\u3002",
    negativeZh:
      "\u7a7a\u95f4\u62e5\u6324\uff0c\u7269\u4f53\u53d8\u5f62\uff0c\u8fc7\u5ea6\u66dd\u5149\uff0c\u5ec9\u4ef7\u6750\u8d28\uff0c\u8272\u5f69\u6df7\u4e71\uff0c\u5bb6\u5177\u6bd4\u4f8b\u9519\u8bef\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c\u5361\u901a\u611f\uff0c\u6c34\u5370\u3002",
    negativeEn:
      "cramped space, object deformation, overexposure, cheap materials, chaotic colors, incorrect furniture scale, low resolution, cartoon style, watermark",
  },
  {
    id: "soft-styling",
    name: "\u8f6f\u88c5\u642d\u914d\u6548\u679c\u56fe",
    note: "\u4e0a\u534a\u90e8\u4ea7\u54c1\u76ee\u5f55\uff0c\u4e0b\u534a\u90e8\u5b9e\u666f\u6e32\u67d3",
    enGuide:
      "Create a professional interior soft furnishing composition board. The upper half is a clean product catalog grid with furniture, decor, lamps, rug, art, and material pieces. The lower half is a high-quality photorealistic 3D interior rendering that integrates all selected items into a cohesive residential scene.",
    zhGuide:
      "\u4e13\u4e1a\u5ba4\u5185\u8bbe\u8ba1\u8f6f\u88c5\u642d\u914d\u6392\u7248\u56fe\uff0c\u4e0a\u534a\u90e8\u4e3a\u7eaf\u51c0\u767d\u5e95\u4ea7\u54c1\u76ee\u5f55\u7f51\u683c\uff0c\u5c55\u793a\u5bb6\u5177\u3001\u706f\u5177\u3001\u5730\u6bef\u3001\u88c5\u9970\u753b\u548c\u6750\u8d28\u5355\u54c1\uff1b\u4e0b\u534a\u90e8\u4e3a\u9ad8\u54c1\u8d28\u7167\u7247\u7ea7 3D \u5ba4\u5185\u5b9e\u666f\u6e32\u67d3\u3002",
    negativeZh:
      "\u5927\u7406\u77f3\uff0c\u5ec9\u4ef7\u6750\u8d28\uff0c\u8fc7\u5ea6\u66dd\u5149\uff0c\u6392\u7248\u6742\u4e71\uff0c\u7a7a\u95f4\u62e5\u6324\uff0c\u7269\u4f53\u53d8\u5f62\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c\u5361\u901a\uff0c\u63d2\u753b\uff0c\u9971\u548c\u5ea6\u8fc7\u9ad8\uff0c\u5927\u9762\u79ef\u9ad8\u5149\u3002",
    negativeEn:
      "marble, cheap materials, overexposure, chaotic layout, cramped space, object deformation, low resolution, cartoon style, illustration style, oversaturated colors, large blown highlights",
  },
  {
    id: "proposal-board",
    name: "\u63d0\u6848\u6392\u7248",
    note: "\u6750\u8d28\u3001\u8272\u5f69\u3001\u5bb6\u5177\u9020\u578b\u5206\u6790\u677f",
    enGuide:
      "Create a professional interior design proposal board with material, color, and furniture form analysis. Use a warm beige background, elegant typography, concise Chinese annotations, clear layout blocks, a refined commercial brochure style, and a main residential interior rendering as the visual anchor.",
    zhGuide:
      "\u4e13\u4e1a\u5ba4\u5185\u8bbe\u8ba1\u8f6f\u88c5\u6750\u8d28\u4e0e\u9020\u578b\u5206\u6790\u56fe\uff0c\u4ee5\u5ba4\u5185\u6e32\u67d3\u56fe\u4e3a\u4e3b\u89c6\u89c9\uff0c\u4e0b\u65b9\u6574\u9f50\u6392\u5217\u8272\u5f69\u5206\u6790\u3001\u6750\u8d28\u5206\u6790\u3001\u5bb6\u5177\u9020\u578b\u5206\u6790\u7b49\u677f\u5757\uff0c\u9644\u5e26\u7b80\u77ed\u4e2d\u6587\u8bf4\u660e\uff0c\u7c73\u8272\u80cc\u666f\uff0c\u9ad8\u7ea7\u5546\u4e1a\u753b\u518c\u8d28\u611f\u3002",
    negativeZh:
      "\u5927\u7406\u77f3\uff0c\u4eae\u9762\u74f7\u7816\uff0c\u8fc7\u5ea6\u66dd\u5149\uff0c\u62fc\u5199\u9519\u8bef\uff0c\u6392\u7248\u6742\u4e71\uff0c\u7a7a\u95f4\u62e5\u6324\uff0c\u7269\u4f53\u53d8\u5f62\uff0c\u4f4e\u5206\u8fa8\u7387\uff0c3D \u5361\u901a\u611f\uff0c\u63d2\u753b\u611f\uff0c\u989c\u8272\u8fc7\u9971\u548c\uff0c\u5927\u9762\u79ef\u4eae\u7247\u3002",
    negativeEn:
      "marble, glossy tiles, overexposure, spelling errors, chaotic layout, cramped space, object deformation, low resolution, 3D cartoon feeling, illustration style, oversaturated colors, large shiny patches",
  },
] as const;

type PromptSchemeId = (typeof promptSchemes)[number]["id"];

const PAGE_CONFIG_STORAGE_KEY = "studiorender_page_config_v1";
const LEGACY_CONTENT_STORAGE_KEY = "studiorender_editable_content_v1";

type EditableSchemeContent = {
  name: string;
  note: string;
};

type EditableRechargePlanContent = {
  name: string;
  price: string;
  credits: string;
};

type EditablePageConfig = {
  brandSubtitle: string;
  outputEyebrow: string;
  generatedPrompt: string;
  detailPlaceholder: string;
  keywordPlaceholder: string;
  promptPlaceholder: string;
  englishPrompt: string;
  chinesePrompt: string;
  negativePrompt: string;
  randomize: string;
  reset: string;
  share: string;
  linkCopied: string;
  recharge: string;
  editContent: string;
  copy: string;
  copied: string;
  aiOptimizeEnglish: string;
  aiOptimizeChinese: string;
  generating: string;
  syncing: string;
  saveKey: string;
  keySaved: string;
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  contentEditorEyebrow: string;
  contentEditorTitle: string;
  contentEditorSubtitle: string;
  saveContent: string;
  resetContent: string;
  contentSaved: string;
  closeEditor: string;
  schemeEditorCountLabel: string;
  planEditorCountLabel: string;
  errorLanguageSync: string;
  errorPromptGeneration: string;
  errorSaveApiKey: string;
  rechargeTitle: string;
  rechargeSubtitle: string;
  manualPayTitle: string;
  customerId: string;
  paymentRemark: string;
  alipay: string;
  wechatPay: string;
  copyOrder: string;
  orderCopied: string;
  manualPayNote: string;
  schemes: Record<PromptSchemeId, EditableSchemeContent>;
  rechargePlans: EditableRechargePlanContent[];
};

type EditablePageConfigTextKey = keyof Omit<EditablePageConfig, "schemes" | "rechargePlans">;

const defaultPageConfig: EditablePageConfig = {
  brandSubtitle: "\u5ba4\u5185\u6e32\u67d3\u63d0\u793a\u8bcd\u5de5\u4f5c\u53f0",
  outputEyebrow: "Generated Prompt",
  generatedPrompt: labels.generatedPrompt,
  detailPlaceholder: labels.detailPlaceholder,
  keywordPlaceholder: labels.keywordPlaceholder,
  promptPlaceholder: labels.promptPlaceholder,
  englishPrompt: labels.englishPrompt,
  chinesePrompt: labels.chinesePrompt,
  negativePrompt: labels.negativePrompt,
  randomize: labels.randomize,
  reset: labels.reset,
  share: labels.share,
  linkCopied: labels.linkCopied,
  recharge: labels.recharge,
  editContent: labels.editContent,
  copy: labels.copy,
  copied: labels.copied,
  aiOptimizeEnglish: labels.aiOptimizeEnglish,
  aiOptimizeChinese: labels.aiOptimizeChinese,
  generating: labels.generating,
  syncing: labels.syncing,
  saveKey: labels.saveKey,
  keySaved: labels.keySaved,
  apiKeyLabel: "OpenAI API Key",
  apiKeyPlaceholder: "sk-...",
  contentEditorEyebrow: "Local Editor",
  contentEditorTitle: labels.contentEditorTitle,
  contentEditorSubtitle: labels.contentEditorSubtitle,
  saveContent: labels.saveContent,
  resetContent: labels.resetContent,
  contentSaved: labels.contentSaved,
  closeEditor: labels.closeEditor,
  schemeEditorCountLabel: "items",
  planEditorCountLabel: "plans",
  errorLanguageSync: "Language sync failed.",
  errorPromptGeneration: "AI prompt generation failed.",
  errorSaveApiKey: "Failed to save API key.",
  rechargeTitle: labels.rechargeTitle,
  rechargeSubtitle: labels.rechargeSubtitle,
  manualPayTitle: labels.manualPayTitle,
  customerId: labels.customerId,
  paymentRemark: labels.paymentRemark,
  alipay: labels.alipay,
  wechatPay: labels.wechatPay,
  copyOrder: labels.copyOrder,
  orderCopied: labels.orderCopied,
  manualPayNote: labels.manualPayNote,
  schemes: promptSchemes.reduce((accumulator, scheme) => {
    accumulator[scheme.id] = {
      name: scheme.name,
      note: scheme.note,
    };
    return accumulator;
  }, {} as Record<PromptSchemeId, EditableSchemeContent>),
  rechargePlans: rechargePlans.map((plan) => ({ ...plan })),
};

function normalizePageConfig(value: unknown): EditablePageConfig {
  const parsed = typeof value === "object" && value !== null ? (value as Partial<EditablePageConfig>) : {};
  const parsedSchemes =
    typeof parsed.schemes === "object" && parsed.schemes !== null
      ? (parsed.schemes as Partial<Record<PromptSchemeId, Partial<EditableSchemeContent>>>)
      : {};
  const schemes = promptSchemes.reduce((accumulator, scheme) => {
    const savedScheme = parsedSchemes[scheme.id];
    accumulator[scheme.id] = {
      ...defaultPageConfig.schemes[scheme.id],
      ...(savedScheme || {}),
    };
    return accumulator;
  }, {} as Record<PromptSchemeId, EditableSchemeContent>);
  const parsedPlans = Array.isArray(parsed.rechargePlans) ? parsed.rechargePlans : [];
  const plans = defaultPageConfig.rechargePlans.map((plan, index) => ({
    ...plan,
    ...(typeof parsedPlans[index] === "object" && parsedPlans[index] !== null ? parsedPlans[index] : {}),
  }));

  return {
    ...defaultPageConfig,
    ...parsed,
    schemes,
    rechargePlans: plans,
  };
}

const translations: Record<string, string> = {
  "\u5ba2\u5385": "living room",
  "\u5367\u5ba4": "bedroom",
  "\u53a8\u623f": "kitchen",
  "\u9910\u5385": "dining room",
  "\u4e66\u623f": "study room",
  "\u6d74\u5ba4": "bathroom",
  "\u7384\u5173": "entryway",
  "\u73b0\u4ee3\u6781\u7b80": "modern minimalist",
  "\u4f98\u5bc2\u98ce": "wabi-sabi",
  "\u5976\u6cb9\u98ce": "soft cream-style",
  "\u4e2d\u53e4\u73b0\u4ee3": "mid-century modern",
  "\u5317\u6b27\u81ea\u7136": "natural Scandinavian",
  "\u8f7b\u5962\u9152\u5e97": "quiet luxury hotel-inspired",
  "\u5de5\u4e1a loft": "industrial loft",
  "\u5b89\u9759\u9ad8\u7ea7": "quiet and elevated",
  "\u660e\u4eae\u901a\u900f": "bright and airy",
  "\u6e29\u6696\u677e\u5f1b": "warm and relaxed",
  "\u620f\u5267\u5316\u5149\u5f71": "dramatic light and shadow",
  "\u6e05\u723d\u514b\u5236": "fresh and restrained",
  "\u827a\u672f\u611f\u5f3a": "art-forward",
  "\u7c73\u767d + \u80e1\u6843\u6728 + \u9ed1\u8272": "warm ivory, walnut wood, and black",
  "\u9f20\u5c3e\u8349\u7eff + \u77f3\u6750\u7070": "sage green and stone gray",
  "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb": "warm white, oak, and linen",
  "\u70ad\u9ed1 + \u9ec4\u94dc + \u6df1\u6728\u8272": "charcoal black, brass, and dark wood",
  "\u9676\u571f\u8272 + \u5976\u6cb9\u767d": "terracotta and cream white",
  "\u5929\u7136\u6728\u76ae": "natural wood veneer",
  "\u5fae\u6c34\u6ce5": "microcement",
  "\u6d1e\u77f3": "travertine",
  "\u4e9a\u9ebb\u7ec7\u7269": "linen textiles",
  "\u62c9\u4e1d\u91d1\u5c5e": "brushed metal",
  "\u85e4\u7f16": "woven rattan",
  "\u78e8\u7802\u73bb\u7483": "frosted glass",
  "\u7ecf\u6d4e\u9884\u7b97": "budget-conscious",
  "\u4e2d\u7b49\u9884\u7b97": "mid-range budget",
  "\u4e2d\u9ad8\u9884\u7b97": "upper-mid-range budget",
  "\u9ad8\u7aef\u5b9a\u5236": "high-end custom budget",
};

type PromptState = {
  scheme: PromptSchemeId;
  space: string;
  style: string;
  mood: string;
  lighting: number;
  palette: string;
  budget: string;
  materials: string[];
  engine: string;
  camera: string;
  detail: string;
  keywords: string;
  englishPromptOverride: string;
  chinesePromptOverride: string;
  negativePromptOverride: string;
};

const initialState: PromptState = {
  scheme: "raw-shell",
  space: "\u5ba2\u5385",
  style: "\u73b0\u4ee3\u6781\u7b80",
  mood: "\u6e29\u6696\u677e\u5f1b",
  lighting: 42,
  palette: "\u6696\u767d + \u6a61\u6728 + \u4e9a\u9ebb",
  budget: "\u4e2d\u9ad8\u9884\u7b97",
  materials: ["\u5929\u7136\u6728\u76ae", "\u5fae\u6c34\u6ce5", "\u62c9\u4e1d\u91d1\u5c5e"],
  engine: "Unreal Engine 5",
  camera: "35mm interior photography",
  detail: "",
  keywords: "",
  englishPromptOverride: "",
  chinesePromptOverride: "",
  negativePromptOverride: "",
};

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function optionButton(active: boolean) {
  return active ? "chip chipActive" : "chip";
}

function getScheme(scheme: string | undefined) {
  return promptSchemes.find((item) => item.id === scheme) ?? promptSchemes[0];
}

function translate(value: string) {
  if (translations[value]) return translations[value];

  return Object.entries(translations)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((text, [source, target]) => text.replaceAll(source, target), value)
    .replace(/\s+/g, " ")
    .trim();
}

function translateList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => translate(item))
    .join(", ");
}

function zhList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\u3001");
}

function lightingDescription(value: number) {
  if (value < 34) return "soft natural daylight, clean morning shadows";
  if (value < 67) return "balanced soft daylight with subtle architectural lighting";
  return "warm golden-hour light, gentle dusk glow, soft elongated shadows";
}

function lightingDescriptionZh(value: number) {
  if (value < 34) return "\u67d4\u548c\u81ea\u7136\u5929\u5149\uff0c\u5e72\u51c0\u7684\u65e9\u6668\u9634\u5f71";
  if (value < 67) return "\u5747\u8861\u67d4\u5149\u4e0e\u7ec6\u817b\u5efa\u7b51\u706f\u5149";
  return "\u6696\u8272\u9ec4\u660f\u5149\uff0c\u67d4\u548c\u66ae\u8272\u6c1b\u56f4\uff0c\u7ec6\u957f\u5149\u5f71";
}

function encodeShareState(state: PromptState) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

function decodeShareState(value: string): PromptState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(value)))) as Partial<PromptState> & { material?: string };
    return {
      ...initialState,
      ...parsed,
      scheme: getScheme(parsed.scheme).id,
      materials: Array.isArray(parsed.materials)
        ? parsed.materials
        : parsed.material
          ? [parsed.material]
          : initialState.materials,
      detail: parsed.detail ?? "",
      keywords: parsed.keywords ?? "",
      englishPromptOverride: parsed.englishPromptOverride ?? "",
      chinesePromptOverride: parsed.chinesePromptOverride ?? "",
      negativePromptOverride: parsed.negativePromptOverride ?? "",
    };
  } catch {
    return null;
  }
}

function buildEnglishPrompt(state: PromptState) {
  const scheme = getScheme(state.scheme);
  const selectedMaterials = state.materials.length > 0 ? state.materials : initialState.materials;
  const userDetail = state.detail.trim() ? `User key details: ${translateList(state.detail)}.` : "User key details: not specified; infer only from selected design parameters.";
  const userKeywords = state.keywords.trim() ? `User keywords: ${translateList(state.keywords)}.` : "User keywords: not specified.";

  return [
    `${scheme.enGuide}`,
    `Design direction: ${translate(state.style)} ${translate(state.space)}, ${translate(state.mood)} atmosphere.`,
    `Palette and materials: ${translate(state.palette)} color palette, ${translateList(selectedMaterials.join(", "))}, realistic tactile surfaces, coherent furniture proportions.`,
    userDetail,
    userKeywords,
    `Lighting: ${lightingDescription(state.lighting)}, premium residential atmosphere.`,
    `Rendering: ${state.engine}, ${state.camera}, eye-level or diagram-appropriate perspective, professionally composed, 8K detail, photorealistic where applicable.`,
    `Constraints: ${translate(state.budget)}, practical circulation, no clutter, cohesive material logic, no visible brand logos.`,
  ].join("\n");
}

function buildChinesePrompt(state: PromptState) {
  const scheme = getScheme(state.scheme);
  const selectedMaterials = state.materials.length > 0 ? state.materials : initialState.materials;
  const userDetail = state.detail.trim() ? `\u5173\u952e\u7ec6\u8282\uff1a${state.detail.trim()}\u3002` : "\u5173\u952e\u7ec6\u8282\uff1a\u672a\u586b\u5199\uff0c\u4ec5\u6839\u636e\u5df2\u9009\u53c2\u6570\u751f\u6210\u3002";
  const userKeywords = state.keywords.trim() ? `\u5173\u952e\u8bcd\uff1a${zhList(state.keywords)}\u3002` : "\u5173\u952e\u8bcd\uff1a\u672a\u586b\u5199\u3002";

  return [
    scheme.zhGuide,
    `\u8bbe\u8ba1\u65b9\u5411\uff1a${state.style}${state.space}\uff0c${state.mood}\u7684\u7a7a\u95f4\u6c1b\u56f4\u3002`,
    `\u914d\u8272\u4e0e\u6750\u8d28\uff1a${state.palette}\uff0c${selectedMaterials.join("\u3001")}\uff0c\u6750\u8d28\u771f\u5b9e\uff0c\u5bb6\u5177\u6bd4\u4f8b\u514b\u5236\u4e14\u7edf\u4e00\u3002`,
    userDetail,
    userKeywords,
    `\u5149\u5f71\uff1a${lightingDescriptionZh(state.lighting)}\uff0c\u9ad8\u7ea7\u5ba4\u5185\u6444\u5f71\u6c1b\u56f4\u3002`,
    `\u6e32\u67d3\uff1a${state.engine}\uff0c${state.camera}\uff0c\u6784\u56fe\u4e13\u4e1a\uff0c8K \u7ec6\u8282\uff0c\u9002\u7528\u573a\u666f\u4fdd\u6301\u7167\u7247\u7ea7\u771f\u5b9e\u611f\u3002`,
    `\u9650\u5236\uff1a${state.budget}\uff0c\u52a8\u7ebf\u5408\u7406\uff0c\u4e0d\u6742\u4e71\uff0c\u6750\u8d28\u903b\u8f91\u7edf\u4e00\uff0c\u65e0\u54c1\u724c logo\u3002`,
  ].join("\n");
}

function buildNegativePrompt(state: PromptState) {
  const scheme = getScheme(state.scheme);
  return `${scheme.negativeEn}\n${scheme.negativeZh}`;
}

export default function Home() {
  const [state, setState] = useState<PromptState>(initialState);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [lastEdited, setLastEdited] = useState<"english" | "chinese" | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOptimizingEnglish, setIsOptimizingEnglish] = useState(false);
  const [isOptimizingChinese, setIsOptimizingChinese] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [pageConfig, setPageConfig] = useState<EditablePageConfig>(defaultPageConfig);
  const [contentSaved, setContentSaved] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const [customerId, setCustomerId] = useState("");
  const [orderCopied, setOrderCopied] = useState(false);
  const syncRequestId = useRef(0);

  useEffect(() => {
    const shareValue = new URLSearchParams(window.location.search).get("design");
    if (!shareValue) return;

    const sharedState = decodeShareState(shareValue);
    if (sharedState) {
      setState(sharedState);
    }
  }, []);

  useEffect(() => {
    try {
      const savedConfig = window.localStorage.getItem(PAGE_CONFIG_STORAGE_KEY) || window.localStorage.getItem(LEGACY_CONTENT_STORAGE_KEY);
      if (!savedConfig) return;
      setPageConfig(normalizePageConfig(JSON.parse(savedConfig)));
    } catch {
      setPageConfig(defaultPageConfig);
    }
  }, []);

  useEffect(() => {
    const existing = window.localStorage.getItem("interior_prompt_customer_id");
    if (existing) {
      setCustomerId(existing);
      return;
    }

    const created = `AIP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    window.localStorage.setItem("interior_prompt_customer_id", created);
    setCustomerId(created);
  }, []);

  const generatedEnglishPrompt = useMemo(() => buildEnglishPrompt(state), [state]);
  const generatedChinesePrompt = useMemo(() => buildChinesePrompt(state), [state]);
  const generatedNegativePrompt = useMemo(() => buildNegativePrompt(state), [state]);
  const effectiveEnglishPrompt = state.englishPromptOverride || generatedEnglishPrompt;
  const effectiveChinesePrompt = state.chinesePromptOverride || generatedChinesePrompt;
  const effectiveNegativePrompt = state.negativePromptOverride || generatedNegativePrompt;
  const selectedPlan = pageConfig.rechargePlans[selectedPlanIndex] ?? pageConfig.rechargePlans[0] ?? defaultPageConfig.rechargePlans[0];

  useEffect(() => {
    if (!lastEdited) return;

    const sourceText = lastEdited === "english" ? state.englishPromptOverride : state.chinesePromptOverride;
    if (!sourceText.trim()) return;

    const requestId = syncRequestId.current + 1;
    syncRequestId.current = requestId;
    const timeout = window.setTimeout(async () => {
      setIsSyncing(true);
      try {
        const response = await fetch("/api/generate-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...state,
            task: "sync-language",
            sourceLanguage: lastEdited,
            targetLanguage: lastEdited === "english" ? "chinese" : "english",
            sourceText,
          }),
        });

        const data = (await response.json()) as { prompt?: string; error?: string };
        if (!response.ok || !data.prompt) {
          throw new Error(data.error || "Language sync failed.");
        }
        if (syncRequestId.current !== requestId) return;

        setState((current) =>
          lastEdited === "english"
            ? { ...current, chinesePromptOverride: data.prompt ?? current.chinesePromptOverride }
            : { ...current, englishPromptOverride: data.prompt ?? current.englishPromptOverride }
        );
        setLastEdited(null);
        setError("");
      } catch (caughtError) {
        if (syncRequestId.current === requestId) {
          setError(caughtError instanceof Error ? caughtError.message : pageConfig.errorLanguageSync);
        }
      } finally {
        if (syncRequestId.current === requestId) {
          setIsSyncing(false);
        }
      }
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [lastEdited, state]);

  const updateState = (patch: Partial<PromptState>, keepOverrides = false) => {
    setState((current) => ({
      ...current,
      ...patch,
      englishPromptOverride: keepOverrides ? (patch.englishPromptOverride ?? current.englishPromptOverride) : "",
      chinesePromptOverride: keepOverrides ? (patch.chinesePromptOverride ?? current.chinesePromptOverride) : "",
      negativePromptOverride: keepOverrides ? (patch.negativePromptOverride ?? current.negativePromptOverride) : "",
    }));
    if (!keepOverrides) setLastEdited(null);
    setError("");
    setShared(false);
  };

  const toggleMaterial = (material: string) => {
    setState((current) => {
      const isSelected = current.materials.includes(material);
      const nextMaterials = isSelected
        ? current.materials.filter((item) => item !== material)
        : [...current.materials, material];

      return {
        ...current,
        materials: nextMaterials.length > 0 ? nextMaterials : current.materials,
        englishPromptOverride: "",
        chinesePromptOverride: "",
        negativePromptOverride: "",
      };
    });
    setLastEdited(null);
    setError("");
    setShared(false);
  };

  const randomize = () => {
    const firstMaterial = pick(materials);
    const secondMaterial = pick(materials.filter((material) => material !== firstMaterial));
    const thirdMaterial = pick(materials.filter((material) => material !== firstMaterial && material !== secondMaterial));

    setState({
      ...initialState,
      scheme: pick(promptSchemes).id,
      space: pick(spaces),
      style: pick(styles),
      mood: pick(moods),
      lighting: Math.floor(18 + Math.random() * 72),
      palette: pick(palettes),
      budget: pick(budgets),
      materials: [firstMaterial, secondMaterial, thirdMaterial],
      engine: pick(engines),
      camera: pick(cameras),
    });
    setCopied(false);
    setShared(false);
    setLastEdited(null);
    setError("");
  };

  const copyPrompt = async () => {
    const copyText = [
      "English Prompt:",
      effectiveEnglishPrompt,
      "",
      "\u4e2d\u6587\u63d0\u793a\u8bcd:",
      effectiveChinesePrompt,
      "",
      "Negative Prompt / \u53cd\u5411\u63d0\u793a\u8bcd:",
      effectiveNegativePrompt,
    ].join("\n");

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareDesign = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("design", encodeShareState(state));
    window.history.replaceState(null, "", url.toString());
    await navigator.clipboard.writeText(url.toString());
    setShared(true);
    window.setTimeout(() => setShared(false), 2200);
  };

  const optimizePrompt = async (targetLanguage: "english" | "chinese") => {
    const setLoading = targetLanguage === "english" ? setIsOptimizingEnglish : setIsOptimizingChinese;
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state,
          task: "optimize",
          targetLanguage,
          sourceText: targetLanguage === "english" ? effectiveEnglishPrompt : effectiveChinesePrompt,
          negativePrompt: effectiveNegativePrompt,
        }),
      });

      const data = (await response.json()) as {
        prompt?: string;
        pairedPrompt?: string;
        negativePrompt?: string;
        error?: string;
      };
      if (!response.ok || !data.prompt) {
        throw new Error(data.error || "AI prompt generation failed.");
      }

      setState((current) =>
        targetLanguage === "english"
          ? {
              ...current,
              englishPromptOverride: data.prompt ?? current.englishPromptOverride,
              chinesePromptOverride: data.pairedPrompt ?? current.chinesePromptOverride,
              negativePromptOverride: data.negativePrompt ?? current.negativePromptOverride,
            }
          : {
              ...current,
              chinesePromptOverride: data.prompt ?? current.chinesePromptOverride,
              englishPromptOverride: data.pairedPrompt ?? current.englishPromptOverride,
              negativePromptOverride: data.negativePrompt ?? current.negativePromptOverride,
            }
      );
      setLastEdited(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : pageConfig.errorPromptGeneration);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    setIsSavingKey(true);
    setError("");
    setKeySaved(false);

    try {
      const response = await fetch("/api/openai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model: "gpt-5.4-mini" }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to save API key.");
      }
      setApiKey("");
      setKeySaved(true);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : pageConfig.errorSaveApiKey);
    } finally {
      setIsSavingKey(false);
    }
  };

  const copyRechargeInfo = async () => {
    const info = [
      `${pageConfig.customerId}: ${customerId}`,
      `${pageConfig.paymentRemark}: ${customerId} / ${selectedPlan.name} / ${selectedPlan.price}`,
      `${selectedPlan.name}: ${selectedPlan.credits}`,
    ].join("\n");

    await navigator.clipboard.writeText(info);
    setOrderCopied(true);
    window.setTimeout(() => setOrderCopied(false), 1800);
  };

  const showKeyBox = error.includes("OPENAI_API_KEY") || keySaved;

  const getEditableScheme = (schemeId: PromptSchemeId) => pageConfig.schemes[schemeId] ?? defaultPageConfig.schemes[schemeId];

  const updatePageConfig = (patch: Partial<Omit<EditablePageConfig, "schemes" | "rechargePlans">>) => {
    setPageConfig((current) => ({ ...current, ...patch }));
    setContentSaved(false);
  };

  const updatePageConfigField = (key: EditablePageConfigTextKey, value: string) => {
    updatePageConfig({ [key]: value } as Partial<Omit<EditablePageConfig, "schemes" | "rechargePlans">>);
  };

  const updateEditableScheme = (schemeId: PromptSchemeId, patch: Partial<EditableSchemeContent>) => {
    setPageConfig((current) => {
      const currentScheme = current.schemes[schemeId] ?? defaultPageConfig.schemes[schemeId];

      return {
        ...current,
        schemes: {
          ...current.schemes,
          [schemeId]: {
            ...currentScheme,
            ...patch,
          },
        },
      };
    });
    setContentSaved(false);
  };

  const updateRechargePlan = (index: number, patch: Partial<EditableRechargePlanContent>) => {
    setPageConfig((current) => ({
      ...current,
      rechargePlans: current.rechargePlans.map((plan, planIndex) => (planIndex === index ? { ...plan, ...patch } : plan)),
    }));
    setContentSaved(false);
  };

  const saveEditableContent = () => {
    window.localStorage.setItem(PAGE_CONFIG_STORAGE_KEY, JSON.stringify(pageConfig));
    window.localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY);
    setContentSaved(true);
    window.setTimeout(() => setContentSaved(false), 1800);
  };

  const resetEditableContent = () => {
    setPageConfig(defaultPageConfig);
    window.localStorage.removeItem(PAGE_CONFIG_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY);
    setSelectedPlanIndex(1);
    setContentSaved(false);
  };

  return (
    <main className="shell">
      <div className="appFrame">
        <header className="topbar">
          <div className="brandBlock" aria-label="StudioRender">
            <strong>STUDIORENDER</strong>
            <span>{pageConfig.brandSubtitle}</span>
          </div>
          <div className="navActions">
            <button className="navIconButton" onClick={randomize} aria-label={pageConfig.randomize} title={pageConfig.randomize}>
              <Dice5 size={18} />
            </button>
            <button className="navIconButton" onClick={() => updateState(initialState)} aria-label={pageConfig.reset} title={pageConfig.reset}>
              <RotateCcw size={18} />
            </button>
            <button className="navButton" onClick={shareDesign}>
              <Share2 size={18} />
              <span>{shared ? pageConfig.linkCopied : pageConfig.share}</span>
            </button>
            <button className="navButton" onClick={() => setShowRecharge(true)}>
              <Wallet size={18} />
              <span>{pageConfig.recharge}</span>
            </button>
            <button className="navButton" onClick={() => setShowContentEditor(true)}>
              <Pencil size={18} />
              <span>{pageConfig.editContent}</span>
            </button>
            <button className="navButton darkButton" onClick={copyPrompt}>
              <Copy size={18} />
              <span>{copied ? pageConfig.copied : pageConfig.copy}</span>
            </button>
          </div>
        </header>

        <section className="workspace">
          <nav className="schemeGroup" aria-label={labels.scheme}>
            <div className="schemeTitle">
              <span>{labels.scheme}</span>
              <strong>{getEditableScheme(state.scheme).name}</strong>
            </div>
            <div className="schemeGrid">
              {promptSchemes.map((scheme) => (
                <button
                  className={state.scheme === scheme.id ? "schemeCard schemeCardActive" : "schemeCard"}
                  key={scheme.id}
                  onClick={(event) => {
                    event.preventDefault();
                    updateState({ scheme: scheme.id });
                  }}
                >
                  <span className="schemeDot" aria-hidden="true" />
                  <strong>{getEditableScheme(scheme.id).name}</strong>
                  <small>{getEditableScheme(scheme.id).note}</small>
                </button>
              ))}
            </div>
          </nav>

          <form className="controls" aria-label="Prompt controls">
            <label className="field controlCard">
              <span>{labels.space}</span>
              <select value={state.space} onChange={(event) => updateState({ space: event.target.value })}>
                {spaces.map((space) => (
                  <option key={space}>{space}</option>
                ))}
              </select>
            </label>

            <ControlGroup label={labels.style}>
              {styles.map((style) => (
                <button
                  className={optionButton(state.style === style)}
                  key={style}
                  onClick={(event) => {
                    event.preventDefault();
                    updateState({ style });
                  }}
                >
                  {style}
                </button>
              ))}
            </ControlGroup>

            <fieldset className="group sliderGroup">
              <legend>{labels.lighting}</legend>
              <div className="sliderLabels">
                <span>{labels.lightingSoft}</span>
                <span>{labels.lightingGolden}</span>
              </div>
              <input
                aria-label={labels.lighting}
                className="lightingSlider"
                max="100"
                min="0"
                type="range"
                value={state.lighting}
                onChange={(event) => updateState({ lighting: Number(event.target.value) })}
              />
            </fieldset>

            <fieldset className="group">
              <legend>{labels.materials}</legend>
              <div className="checkGrid">
                {materials.map((material) => (
                  <label className={state.materials.includes(material) ? "checkCard checkCardActive" : "checkCard"} key={material}>
                    <input checked={state.materials.includes(material)} onChange={() => toggleMaterial(material)} type="checkbox" />
                    <span>{material}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>{labels.engine}</legend>
              <div className="segmentControl">
                {engines.map((engine) => (
                  <button
                    className={state.engine === engine ? "segmentButton segmentButtonActive" : "segmentButton"}
                    key={engine}
                    onClick={(event) => {
                      event.preventDefault();
                      updateState({ engine });
                    }}
                  >
                    {engine}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="field">
              <span>{labels.palette}</span>
              <select value={state.palette} onChange={(event) => updateState({ palette: event.target.value })}>
                {palettes.map((palette) => (
                  <option key={palette}>{palette}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{labels.budget}</span>
              <select value={state.budget} onChange={(event) => updateState({ budget: event.target.value })}>
                {budgets.map((budget) => (
                  <option key={budget}>{budget}</option>
                ))}
              </select>
            </label>

            <ControlGroup label={labels.mood}>
              {moods.map((mood) => (
                <button
                  className={optionButton(state.mood === mood)}
                  key={mood}
                  onClick={(event) => {
                    event.preventDefault();
                    updateState({ mood });
                  }}
                >
                  {mood}
                </button>
              ))}
            </ControlGroup>

            <label className="field wide">
              <span>{labels.detail}</span>
              <textarea
                value={state.detail}
                onChange={(event) => updateState({ detail: event.target.value })}
                placeholder={pageConfig.detailPlaceholder}
              />
            </label>

            <label className="field wide">
              <span>{labels.keywords}</span>
              <textarea
                className="keywordsInput"
                value={state.keywords}
                onChange={(event) => updateState({ keywords: event.target.value })}
                placeholder={pageConfig.keywordPlaceholder}
              />
            </label>
          </form>

          <aside className="output">
            <div className="outputTop">
              <span className="eyebrow">{pageConfig.outputEyebrow}</span>
              <h2>{pageConfig.generatedPrompt}</h2>
              {isSyncing ? <small className="syncText">{pageConfig.syncing}</small> : null}
            </div>
            {error ? <p className="errorText">{error}</p> : null}
            {showKeyBox ? (
              <div className="keyBox">
                <label className="field">
                  <span>{pageConfig.apiKeyLabel}</span>
                  <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={pageConfig.apiKeyPlaceholder} type="password" />
                </label>
                <button className="saveKeyButton" onClick={saveApiKey} disabled={isSavingKey || apiKey.length < 20}>
                  {isSavingKey ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
                  {keySaved ? pageConfig.keySaved : pageConfig.saveKey}
                </button>
              </div>
            ) : null}

            <div className="promptPanels">
              <section className="promptPanel englishPanel">
                <div className="promptPanelHeader">
                  <span>{pageConfig.englishPrompt}</span>
                  <button className="miniAiButton" onClick={() => optimizePrompt("english")} disabled={isOptimizingEnglish}>
                    {isOptimizingEnglish ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
                    {isOptimizingEnglish ? pageConfig.generating : pageConfig.aiOptimizeEnglish}
                  </button>
                </div>
                <textarea
                  className="promptBox promptBoxLarge"
                  value={effectiveEnglishPrompt}
                  onChange={(event) => {
                    updateState({ englishPromptOverride: event.target.value }, true);
                    setLastEdited("english");
                  }}
                  placeholder={pageConfig.promptPlaceholder}
                />
              </section>

              <section className="promptPanel chinesePanel">
                <div className="promptPanelHeader">
                  <span>{pageConfig.chinesePrompt}</span>
                  <button className="miniAiButton lightMiniButton" onClick={() => optimizePrompt("chinese")} disabled={isOptimizingChinese}>
                    {isOptimizingChinese ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
                    {isOptimizingChinese ? pageConfig.generating : pageConfig.aiOptimizeChinese}
                  </button>
                </div>
                <textarea
                  className="promptBox promptBoxSmall"
                  value={effectiveChinesePrompt}
                  onChange={(event) => {
                    updateState({ chinesePromptOverride: event.target.value }, true);
                    setLastEdited("chinese");
                  }}
                  placeholder={pageConfig.promptPlaceholder}
                />
              </section>

              <section className="promptPanel negativePanel">
                <div className="promptPanelHeader">
                  <span>{pageConfig.negativePrompt}</span>
                </div>
                <textarea
                  className="promptBox negativeBox"
                  value={effectiveNegativePrompt}
                  onChange={(event) => updateState({ negativePromptOverride: event.target.value }, true)}
                />
              </section>
            </div>
          </aside>
        </section>
      </div>

      {showContentEditor ? (
        <aside className="contentEditorLayer" aria-label={pageConfig.contentEditorTitle}>
          <div className="contentEditorPanel">
            <div className="contentEditorHeader">
              <div>
                <span className="eyebrow">{pageConfig.contentEditorEyebrow}</span>
                <h3>{pageConfig.contentEditorTitle}</h3>
                <p>{pageConfig.contentEditorSubtitle}</p>
              </div>
              <button className="editorIconButton" onClick={() => setShowContentEditor(false)} aria-label={pageConfig.closeEditor}>
                <X size={20} />
              </button>
            </div>

            <div className="editorActions">
              <button className="editorActionButton editorSaveButton" onClick={saveEditableContent}>
                <Save size={17} />
                <span>{contentSaved ? pageConfig.contentSaved : pageConfig.saveContent}</span>
              </button>
              <button className="editorActionButton" onClick={resetEditableContent}>
                <RotateCcw size={17} />
                <span>{pageConfig.resetContent}</span>
              </button>
            </div>

            <div className="editorSection">
              <div className="editorSectionTitle">
                <span>Page copy</span>
              </div>
              <label className="field editorField">
                <span>{labels.brandSubtitle}</span>
                <input
                  value={pageConfig.brandSubtitle}
                  onChange={(event) => updatePageConfig({ brandSubtitle: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>输出区小标题</span>
                <input value={pageConfig.outputEyebrow} onChange={(event) => updatePageConfig({ outputEyebrow: event.target.value })} />
              </label>
              <label className="field editorField">
                <span>{labels.generatedPrompt}</span>
                <input
                  value={pageConfig.generatedPrompt}
                  onChange={(event) => updatePageConfig({ generatedPrompt: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>{labels.englishPrompt}</span>
                <input
                  value={pageConfig.englishPrompt}
                  onChange={(event) => updatePageConfig({ englishPrompt: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>{labels.chinesePrompt}</span>
                <input
                  value={pageConfig.chinesePrompt}
                  onChange={(event) => updatePageConfig({ chinesePrompt: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>{labels.negativePrompt}</span>
                <input
                  value={pageConfig.negativePrompt}
                  onChange={(event) => updatePageConfig({ negativePrompt: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>提示词空状态</span>
                <textarea value={pageConfig.promptPlaceholder} onChange={(event) => updatePageConfig({ promptPlaceholder: event.target.value })} />
              </label>
              <label className="field editorField">
                <span>{labels.detail}</span>
                <textarea
                  value={pageConfig.detailPlaceholder}
                  onChange={(event) => updatePageConfig({ detailPlaceholder: event.target.value })}
                />
              </label>
              <label className="field editorField">
                <span>{labels.keywords}</span>
                <textarea
                  value={pageConfig.keywordPlaceholder}
                  onChange={(event) => updatePageConfig({ keywordPlaceholder: event.target.value })}
                />
              </label>
            </div>

            <div className="editorSection">
              <div className="editorSectionTitle">
                <span>Buttons and status</span>
              </div>
              {(
                [
                  ["randomize", "随机按钮提示"],
                  ["reset", "重置按钮提示"],
                  ["share", "分享按钮"],
                  ["linkCopied", "分享成功"],
                  ["recharge", "充值按钮"],
                  ["editContent", "编辑按钮"],
                  ["copy", "复制按钮"],
                  ["copied", "复制成功"],
                  ["aiOptimizeEnglish", "AI 优化英文"],
                  ["aiOptimizeChinese", "AI 优化中文"],
                  ["generating", "生成中"],
                  ["syncing", "同步中"],
                  ["saveKey", "保存 Key"],
                  ["keySaved", "Key 保存成功"],
                  ["apiKeyLabel", "API Key 标题"],
                  ["apiKeyPlaceholder", "API Key 占位"],
                  ["contentEditorEyebrow", "编辑器小标题"],
                  ["contentEditorTitle", "编辑器标题"],
                  ["contentEditorSubtitle", "编辑器说明"],
                  ["saveContent", "保存按钮"],
                  ["resetContent", "重置配置按钮"],
                  ["contentSaved", "配置保存成功"],
                  ["closeEditor", "关闭按钮说明"],
                  ["errorLanguageSync", "同步错误提示"],
                  ["errorPromptGeneration", "AI 错误提示"],
                  ["errorSaveApiKey", "Key 保存错误提示"],
                ] as const
              ).map(([key, label]) => (
                <label className="field editorField" key={key}>
                  <span>{label}</span>
                  <input value={pageConfig[key]} onChange={(event) => updatePageConfigField(key, event.target.value)} />
                </label>
              ))}
            </div>

            <div className="editorSection">
              <div className="editorSectionTitle">
                <span>{labels.scheme}</span>
                <small>
                  {promptSchemes.length} {pageConfig.schemeEditorCountLabel}
                </small>
              </div>
              <label className="field editorField">
                <span>方案计数单位</span>
                <input value={pageConfig.schemeEditorCountLabel} onChange={(event) => updatePageConfig({ schemeEditorCountLabel: event.target.value })} />
              </label>
              {promptSchemes.map((scheme) => {
                const schemeContent = getEditableScheme(scheme.id);
                return (
                  <div className="schemeEditorCard" key={scheme.id}>
                    <label className="field editorField">
                      <span>{scheme.id} / name</span>
                      <input
                        value={schemeContent.name}
                        onChange={(event) => updateEditableScheme(scheme.id, { name: event.target.value })}
                      />
                    </label>
                    <label className="field editorField">
                      <span>{scheme.id} / note</span>
                      <textarea
                        value={schemeContent.note}
                        onChange={(event) => updateEditableScheme(scheme.id, { note: event.target.value })}
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="editorSection">
              <div className="editorSectionTitle">
                <span>Recharge modal</span>
              </div>
              {(
                [
                  ["rechargeTitle", "充值标题"],
                  ["rechargeSubtitle", "充值说明"],
                  ["manualPayTitle", "扫码支付标题"],
                  ["customerId", "客户编号"],
                  ["paymentRemark", "付款备注"],
                  ["alipay", "支付宝标题"],
                  ["wechatPay", "微信支付标题"],
                  ["copyOrder", "复制充值信息"],
                  ["orderCopied", "充值信息已复制"],
                  ["manualPayNote", "支付说明"],
                ] as const
              ).map(([key, label]) => (
                <label className="field editorField" key={key}>
                  <span>{label}</span>
                  {key === "rechargeSubtitle" || key === "manualPayNote" ? (
                    <textarea value={pageConfig[key]} onChange={(event) => updatePageConfigField(key, event.target.value)} />
                  ) : (
                    <input value={pageConfig[key]} onChange={(event) => updatePageConfigField(key, event.target.value)} />
                  )}
                </label>
              ))}
            </div>

            <div className="editorSection">
              <div className="editorSectionTitle">
                <span>Recharge plans</span>
                <small>
                  {pageConfig.rechargePlans.length} {pageConfig.planEditorCountLabel}
                </small>
              </div>
              <label className="field editorField">
                <span>套餐计数单位</span>
                <input value={pageConfig.planEditorCountLabel} onChange={(event) => updatePageConfig({ planEditorCountLabel: event.target.value })} />
              </label>
              {pageConfig.rechargePlans.map((plan, index) => (
                <div className="schemeEditorCard" key={index}>
                  <label className="field editorField">
                    <span>plan {index + 1} / name</span>
                    <input value={plan.name} onChange={(event) => updateRechargePlan(index, { name: event.target.value })} />
                  </label>
                  <label className="field editorField">
                    <span>plan {index + 1} / price</span>
                    <input value={plan.price} onChange={(event) => updateRechargePlan(index, { price: event.target.value })} />
                  </label>
                  <label className="field editorField">
                    <span>plan {index + 1} / credits</span>
                    <input value={plan.credits} onChange={(event) => updateRechargePlan(index, { credits: event.target.value })} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>
      ) : null}

      {showRecharge ? (
        <div className="modalLayer" role="dialog" aria-modal="true" aria-labelledby="recharge-title">
          <div className="modalPanel">
            <button className="modalClose" onClick={() => setShowRecharge(false)} aria-label="Close">
              <X size={20} />
            </button>
            <div className="modalHeader">
              <Wallet size={24} />
              <div>
                <h3 id="recharge-title">{pageConfig.rechargeTitle}</h3>
                <p>{pageConfig.rechargeSubtitle}</p>
              </div>
            </div>
            <div className="plans">
              {pageConfig.rechargePlans.map((plan, index) => (
                <button className={selectedPlanIndex === index ? "planCard planCardActive" : "planCard"} key={`${index}-${plan.name}`} onClick={() => setSelectedPlanIndex(index)}>
                  <span>{plan.name}</span>
                  <strong>{plan.price}</strong>
                  <small>{plan.credits}</small>
                </button>
              ))}
            </div>
            <div className="manualPayBox">
              <h4>{pageConfig.manualPayTitle}</h4>
              <div className="qrGrid">
                <figure className="qrCard">
                  <img src="/images/alipay-qr.jpg" alt={pageConfig.alipay} />
                  <figcaption>{pageConfig.alipay}</figcaption>
                </figure>
                <figure className="qrCard">
                  <img src="/images/wechat-pay-qr.jpg" alt={pageConfig.wechatPay} />
                  <figcaption>{pageConfig.wechatPay}</figcaption>
                </figure>
              </div>
              <dl>
                <div>
                  <dt>{pageConfig.customerId}</dt>
                  <dd>{customerId}</dd>
                </div>
                <div>
                  <dt>{pageConfig.paymentRemark}</dt>
                  <dd>
                    {customerId} / {selectedPlan.name} / {selectedPlan.price}
                  </dd>
                </div>
              </dl>
              <p>{pageConfig.manualPayNote}</p>
            </div>
            <button className="payButton" onClick={copyRechargeInfo}>
              {orderCopied ? pageConfig.orderCopied : pageConfig.copyOrder}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="group">
      <legend>{label}</legend>
      <div className="chips">{children}</div>
    </fieldset>
  );
}
