# AdCraft AI — Complete Architecture & Implementation

## Folder Structure

```
adcraft-ai/
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── prisma/
│   └── schema.prisma
├── public/
│   ├── fonts/
│   └── icons/
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                          # Landing page
    │   ├── (auth)/
    │   │   ├── sign-in/page.tsx
    │   │   └── sign-up/page.tsx
    │   ├── (dashboard)/
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── create/page.tsx               # Main creation flow
    │   │   ├── projects/page.tsx
    │   │   ├── projects/[id]/page.tsx
    │   │   ├── templates/page.tsx
    │   │   ├── brand-kit/page.tsx
    │   │   └── settings/page.tsx
    │   └── api/
    │       ├── upload/route.ts
    │       ├── analyze/route.ts
    │       ├── script/route.ts
    │       ├── storyboard/route.ts
    │       ├── video/
    │       │   ├── generate/route.ts
    │       │   ├── status/[jobId]/route.ts
    │       │   └── export/route.ts
    │       ├── voiceover/route.ts
    │       ├── marketing-copy/route.ts
    │       ├── webhooks/
    │       │   ├── stripe/route.ts
    │       │   └── clerk/route.ts
    │       └── trpc/[trpc]/route.ts
    ├── components/
    │   ├── ui/                               # shadcn/ui components
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   ├── TopNav.tsx
    │   │   └── MobileNav.tsx
    │   ├── create/
    │   │   ├── UploadZone.tsx
    │   │   ├── ProductForm.tsx
    │   │   ├── PromptBox.tsx
    │   │   ├── TemplateSelector.tsx
    │   │   ├── StylePicker.tsx
    │   │   ├── VoiceSelector.tsx
    │   │   ├── FormatSelector.tsx
    │   │   └── GenerationProgress.tsx
    │   ├── script/
    │   │   ├── ScriptEditor.tsx
    │   │   └── StoryboardView.tsx
    │   ├── video/
    │   │   ├── VideoPlayer.tsx
    │   │   ├── VideoExport.tsx
    │   │   └── VideoPreview.tsx
    │   ├── marketing/
    │   │   └── MarketingCopyPanel.tsx
    │   ├── dashboard/
    │   │   ├── ProjectCard.tsx
    │   │   ├── StatsCard.tsx
    │   │   └── RecentProjects.tsx
    │   └── brand-kit/
    │       └── BrandKitEditor.tsx
    ├── lib/
    │   ├── ai/
    │   │   ├── providers/
    │   │   │   ├── base.ts                   # Base adapter interface
    │   │   │   ├── openai.ts
    │   │   │   ├── claude.ts
    │   │   │   ├── gemini.ts
    │   │   │   └── index.ts                  # Provider factory
    │   │   ├── video/
    │   │   │   ├── base.ts
    │   │   │   ├── runway.ts
    │   │   │   ├── kling.ts
    │   │   │   ├── pika.ts
    │   │   │   ├── luma.ts
    │   │   │   └── index.ts
    │   │   ├── analyzer.ts                   # Image analysis
    │   │   ├── scriptGenerator.ts
    │   │   ├── storyboardGenerator.ts
    │   │   └── marketingCopyGenerator.ts
    │   ├── storage/
    │   │   └── r2.ts                         # Cloudflare R2 client
    │   ├── db/
    │   │   └── prisma.ts                     # Prisma singleton
    │   ├── stripe.ts
    │   ├── clerk.ts
    │   └── utils.ts
    ├── hooks/
    │   ├── useUpload.ts
    │   ├── useGeneration.ts
    │   └── useProject.ts
    ├── store/
    │   └── creation.ts                       # Zustand store
    └── types/
        ├── ai.ts
        ├── video.ts
        ├── project.ts
        └── index.ts
```
