# Diff Details

Date : 2026-01-05 10:38:31

Directory c:\\Projects\\NextJS\\bimformative

Total : 129 files,  899 codes, -3 comments, 84 blanks, all 980 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [app/actions/addscript.ts](/app/actions/addscript.ts) | TypeScript | -28 | 0 | -8 | -36 |
| [app/actions/clientActions.ts](/app/actions/clientActions.ts) | TypeScript | 13 | 2 | 5 | 20 |
| [app/actions/serverActions.ts](/app/actions/serverActions.ts) | TypeScript | 253 | 31 | 80 | 364 |
| [app/api/blogs/route.ts](/app/api/blogs/route.ts) | TypeScript | -41 | -2 | -6 | -49 |
| [app/api/blogs/tags/route.ts](/app/api/blogs/tags/route.ts) | TypeScript | -25 | -1 | -4 | -30 |
| [app/api/download/route.ts](/app/api/download/route.ts) | TypeScript | -29 | -2 | -12 | -43 |
| [app/api/handleDownload.ts](/app/api/handleDownload.ts) | TypeScript | -17 | 0 | -1 | -18 |
| [app/api/kitSubscribe/route.ts](/app/api/kitSubscribe/route.ts) | TypeScript | -53 | -8 | -15 | -76 |
| [app/api/message/route.ts](/app/api/message/route.ts) | TypeScript | -104 | -9 | -25 | -138 |
| [app/api/openapi/route.ts](/app/api/openapi/route.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [app/api/public/v1/scripts/route.ts](/app/api/public/v1/scripts/route.ts) | TypeScript | 14 | 0 | 4 | 18 |
| [app/api/public/v1/search/route.ts](/app/api/public/v1/search/route.ts) | TypeScript | 38 | 0 | 5 | 43 |
| [app/api/resourceCount/route.ts](/app/api/resourceCount/route.ts) | TypeScript | -19 | 0 | -2 | -21 |
| [app/api/resources/route.ts](/app/api/resources/route.ts) | TypeScript | -47 | -2 | -9 | -58 |
| [app/api/roadmap/route.ts](/app/api/roadmap/route.ts) | TypeScript | -25 | -1 | -4 | -30 |
| [app/api/script-versions/\[versionId\]/download/route.ts](/app/api/script-versions/%5BversionId%5D/download/route.ts) | TypeScript | -34 | -2 | -7 | -43 |
| [app/api/script-versions/\[versionId\]/route.ts](/app/api/script-versions/%5BversionId%5D/route.ts) | TypeScript | -131 | -10 | -29 | -170 |
| [app/api/script-versions/\[versionId\]/set-current/route.ts](/app/api/script-versions/%5BversionId%5D/set-current/route.ts) | TypeScript | -74 | -5 | -14 | -93 |
| [app/api/scripts/\[slug\]/download/route.ts](/app/api/scripts/%5Bslug%5D/download/route.ts) | TypeScript | -47 | -1 | -10 | -58 |
| [app/api/scripts/\[slug\]/route.ts](/app/api/scripts/%5Bslug%5D/route.ts) | TypeScript | -15 | 0 | -4 | -19 |
| [app/api/scripts/\[slug\]/versions/route.ts](/app/api/scripts/%5Bslug%5D/versions/route.ts) | TypeScript | -35 | 0 | -7 | -42 |
| [app/api/scripts/analyze/route.ts](/app/api/scripts/analyze/route.ts) | TypeScript | -40 | -3 | -12 | -55 |
| [app/api/scripts/by-id/\[scriptId\]/get-versions/route.ts](/app/api/scripts/by-id/%5BscriptId%5D/get-versions/route.ts) | TypeScript | -24 | 0 | -5 | -29 |
| [app/api/scripts/by-id/\[scriptId\]/route.ts](/app/api/scripts/by-id/%5BscriptId%5D/route.ts) | TypeScript | -282 | -17 | -58 | -357 |
| [app/api/scripts/by-id/\[scriptId\]/set-active-version/route.ts](/app/api/scripts/by-id/%5BscriptId%5D/set-active-version/route.ts) | TypeScript | -21 | 0 | -5 | -26 |
| [app/api/scripts/by-id/\[scriptId\]/update/route.ts](/app/api/scripts/by-id/%5BscriptId%5D/update/route.ts) | TypeScript | -44 | -1 | -8 | -53 |
| [app/api/scripts/publish/route.ts](/app/api/scripts/publish/route.ts) | TypeScript | -175 | -16 | -42 | -233 |
| [app/api/scripts/python-nodes/route.ts](/app/api/scripts/python-nodes/route.ts) | TypeScript | -36 | -1 | -6 | -43 |
| [app/api/scripts/route.ts](/app/api/scripts/route.ts) | TypeScript | -67 | -6 | -12 | -85 |
| [app/api/scripts/slugs/route.ts](/app/api/scripts/slugs/route.ts) | TypeScript | -14 | 0 | -5 | -19 |
| [app/api/scripts/upload/route.ts](/app/api/scripts/upload/route.ts) | TypeScript | -146 | -8 | -31 | -185 |
| [app/api/subscribe/route.ts](/app/api/subscribe/route.ts) | TypeScript | -60 | -9 | -15 | -84 |
| [app/api/upload/route.ts](/app/api/upload/route.ts) | TypeScript | -36 | -1 | -13 | -50 |
| [app/api/users/route.ts](/app/api/users/route.ts) | TypeScript | -30 | 0 | -6 | -36 |
| [app/api/v1/script-versions/\[versionId\]/download/route.ts](/app/api/v1/script-versions/%5BversionId%5D/download/route.ts) | TypeScript | 46 | 0 | 9 | 55 |
| [app/api/v1/scripts/\[slug\]/download/route.ts](/app/api/v1/scripts/%5Bslug%5D/download/route.ts) | TypeScript | 46 | 0 | 9 | 55 |
| [app/api/v1/scripts/analyze/route.ts](/app/api/v1/scripts/analyze/route.ts) | TypeScript | 34 | 0 | 8 | 42 |
| [app/api/v1/subscribe/route.ts](/app/api/v1/subscribe/route.ts) | TypeScript | 26 | 0 | 4 | 30 |
| [app/api/webhooks/clerk/route.ts](/app/api/webhooks/clerk/route.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [app/blog/\[slug\]/page.tsx](/app/blog/%5Bslug%5D/page.tsx) | TypeScript JSX | -10 | 0 | -1 | -11 |
| [app/blog/page.tsx](/app/blog/page.tsx) | TypeScript JSX | -65 | -1 | -9 | -75 |
| [app/canvas/page.tsx](/app/canvas/page.tsx) | TypeScript JSX | -30 | 0 | -6 | -36 |
| [app/components/AboutSection.tsx](/app/components/AboutSection.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [app/components/Blogs.tsx](/app/components/Blogs.tsx) | TypeScript JSX | -1 | 0 | 0 | -1 |
| [app/components/CommentForm.tsx](/app/components/CommentForm.tsx) | TypeScript JSX | 56 | 6 | 15 | 77 |
| [app/components/ContactForm.tsx](/app/components/ContactForm.tsx) | TypeScript JSX | -62 | -2 | -5 | -69 |
| [app/components/DialogDelete.tsx](/app/components/DialogDelete.tsx) | TypeScript JSX | -34 | 0 | -1 | -35 |
| [app/components/DialogDetails.tsx](/app/components/DialogDetails.tsx) | TypeScript JSX | -221 | -3 | -16 | -240 |
| [app/components/DialogEdit.tsx](/app/components/DialogEdit.tsx) | TypeScript JSX | -155 | 0 | -6 | -161 |
| [app/components/DownloadButton.tsx](/app/components/DownloadButton.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [app/components/Footer.tsx](/app/components/Footer.tsx) | TypeScript JSX | 0 | -18 | -2 | -20 |
| [app/components/Hero.tsx](/app/components/Hero.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [app/components/LatestBlogs.tsx](/app/components/LatestBlogs.tsx) | TypeScript JSX | 0 | 0 | -1 | -1 |
| [app/components/LikeButton.tsx](/app/components/LikeButton.tsx) | TypeScript JSX | 46 | 4 | 7 | 57 |
| [app/components/Navbar.tsx](/app/components/Navbar.tsx) | TypeScript JSX | -74 | -69 | 2 | -141 |
| [app/components/NewsletterSignup.tsx](/app/components/NewsletterSignup.tsx) | TypeScript JSX | -2 | 0 | -1 | -3 |
| [app/components/ResourceHighlights.tsx](/app/components/ResourceHighlights.tsx) | TypeScript JSX | -6 | 9 | 2 | 5 |
| [app/components/Roadmap.tsx](/app/components/Roadmap.tsx) | TypeScript JSX | -55 | 0 | -1 | -56 |
| [app/components/RoadmapList.tsx](/app/components/RoadmapList.tsx) | TypeScript JSX | 32 | 0 | 2 | 34 |
| [app/components/UploadDialog.tsx](/app/components/UploadDialog.tsx) | TypeScript JSX | -11 | 6 | -5 | -10 |
| [app/components/UploadVersion.tsx](/app/components/UploadVersion.tsx) | TypeScript JSX | 136 | 3 | 16 | 155 |
| [app/components/UserActionMenu.tsx](/app/components/UserActionMenu.tsx) | TypeScript JSX | 21 | 0 | 5 | 26 |
| [app/components/UserMenu.tsx](/app/components/UserMenu.tsx) | TypeScript JSX | -4 | 0 | -1 | -5 |
| [app/components/navbar/NavbarClient.tsx](/app/components/navbar/NavbarClient.tsx) | TypeScript JSX | 125 | 2 | 13 | 140 |
| [app/components/navbar/navigation.config.ts](/app/components/navbar/navigation.config.ts) | TypeScript | 18 | 0 | 0 | 18 |
| [app/components/scripts/ClientVersionSheet.tsx](/app/components/scripts/ClientVersionSheet.tsx) | TypeScript JSX | 17 | 0 | 1 | 18 |
| [app/components/scripts/CompareVersionDialog.tsx](/app/components/scripts/CompareVersionDialog.tsx) | TypeScript JSX | -6 | 0 | 0 | -6 |
| [app/components/scripts/EditDialog.tsx](/app/components/scripts/EditDialog.tsx) | TypeScript JSX | -14 | 14 | 5 | 5 |
| [app/components/scripts/UpdateDialog.tsx](/app/components/scripts/UpdateDialog.tsx) | TypeScript JSX | -15 | 1 | -2 | -16 |
| [app/components/scripts/VersionActionMenu.tsx](/app/components/scripts/VersionActionMenu.tsx) | TypeScript JSX | -12 | 0 | -4 | -16 |
| [app/components/scripts/version-columns.tsx](/app/components/scripts/version-columns.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [app/components/scripts/version-sheet-content.tsx](/app/components/scripts/version-sheet-content.tsx) | TypeScript JSX | -4 | 0 | -2 | -6 |
| [app/components/scripts/version-table.tsx](/app/components/scripts/version-table.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [app/components/svg/ScriptViewCanvas.tsx](/app/components/svg/ScriptViewCanvas.tsx) | TypeScript JSX | -6 | -6 | 6 | -6 |
| [app/dashboard/page.tsx](/app/dashboard/page.tsx) | TypeScript JSX | -11 | 0 | 3 | -8 |
| [app/dashboard/usercolumns.tsx](/app/dashboard/usercolumns.tsx) | TypeScript JSX | -13 | -1 | -1 | -15 |
| [app/layout.tsx](/app/layout.tsx) | TypeScript JSX | -3 | 0 | 1 | -2 |
| [app/lib/api.ts](/app/lib/api.ts) | TypeScript | -155 | 0 | -23 | -178 |
| [app/lib/blog.ts](/app/lib/blog.ts) | TypeScript | -16 | 0 | -3 | -19 |
| [app/lib/interface.ts](/app/lib/interface.ts) | TypeScript | 42 | 0 | 4 | 46 |
| [app/lib/sanityQueries.ts](/app/lib/sanityQueries.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [app/page.tsx](/app/page.tsx) | TypeScript JSX | -3 | 0 | 0 | -3 |
| [app/resources/dynamo-scripts/\[slug\]/page.tsx](/app/resources/dynamo-scripts/%5Bslug%5D/page.tsx) | TypeScript JSX | -23 | 0 | -6 | -29 |
| [app/resources/dynamo-scripts/by-id/page.tsx](/app/resources/dynamo-scripts/by-id/page.tsx) | TypeScript JSX | -208 | -4 | -14 | -226 |
| [app/resources/dynamo-scripts/columns.tsx](/app/resources/dynamo-scripts/columns.tsx) | TypeScript JSX | -9 | -1 | -4 | -14 |
| [app/resources/dynamo-scripts/page.tsx](/app/resources/dynamo-scripts/page.tsx) | TypeScript JSX | 4 | -1 | 4 | 7 |
| [app/scriptcompare/page.tsx](/app/scriptcompare/page.tsx) | TypeScript JSX | -147 | -5 | -24 | -176 |
| [app/search/page.tsx](/app/search/page.tsx) | TypeScript JSX | -3 | 1 | 0 | -2 |
| [app/sitemap.ts](/app/sitemap.ts) | TypeScript | -1 | 0 | 1 | 0 |
| [app/tools/dynanalyzer/page.tsx](/app/tools/dynanalyzer/page.tsx) | TypeScript JSX | 157 | 0 | 14 | 171 |
| [app/tools/scriptcompare/page.tsx](/app/tools/scriptcompare/page.tsx) | TypeScript JSX | 261 | 9 | 40 | 310 |
| [app/upload/page.tsx](/app/upload/page.tsx) | TypeScript JSX | -163 | 0 | -16 | -179 |
| [components/ui/code-comparison.tsx](/components/ui/code-comparison.tsx) | TypeScript JSX | -147 | -1 | -11 | -159 |
| [components/ui/magicui/aurora-text.tsx](/components/ui/magicui/aurora-text.tsx) | TypeScript JSX | 38 | 0 | 6 | 44 |
| [components/ui/magicui/number-ticker.tsx](/components/ui/magicui/number-ticker.tsx) | TypeScript JSX | 60 | 0 | 9 | 69 |
| [components/ui/magicui/shine-border.tsx](/components/ui/magicui/shine-border.tsx) | TypeScript JSX | 42 | 17 | 5 | 64 |
| [components/ui/magicui/text-reveal.tsx](/components/ui/magicui/text-reveal.tsx) | TypeScript JSX | 62 | 0 | 10 | 72 |
| [hooks/use-toast.ts](/hooks/use-toast.ts) | TypeScript | -160 | -3 | -32 | -195 |
| [lib/openapi/base.ts](/lib/openapi/base.ts) | TypeScript | 22 | 0 | 1 | 23 |
| [lib/openapi/index.ts](/lib/openapi/index.ts) | TypeScript | 15 | 0 | 1 | 16 |
| [lib/openapi/paths.ts](/lib/openapi/paths.ts) | TypeScript | 26 | 0 | 0 | 26 |
| [lib/openapi/schemas.ts](/lib/openapi/schemas.ts) | TypeScript | 19 | 0 | 2 | 21 |
| [lib/services/comments.select.ts](/lib/services/comments.select.ts) | TypeScript | 12 | 0 | 0 | 12 |
| [lib/services/comments.service.ts](/lib/services/comments.service.ts) | TypeScript | 52 | 0 | 19 | 71 |
| [lib/services/contact.service.ts](/lib/services/contact.service.ts) | TypeScript | 72 | 4 | 11 | 87 |
| [lib/services/dynalyzer.service.ts](/lib/services/dynalyzer.service.ts) | TypeScript | 32 | 2 | 9 | 43 |
| [lib/services/kit.service.ts](/lib/services/kit.service.ts) | TypeScript | 39 | 2 | 9 | 50 |
| [lib/services/likes.service.ts](/lib/services/likes.service.ts) | TypeScript | 29 | 3 | 8 | 40 |
| [lib/services/profile.select.ts](/lib/services/profile.select.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [lib/services/profiles.service.ts](/lib/services/profiles.service.ts) | TypeScript | 12 | 0 | 3 | 15 |
| [lib/services/sanity.service.ts](/lib/services/sanity.service.ts) | TypeScript | 233 | 8 | 27 | 268 |
| [lib/services/scripts.select.ts](/lib/services/scripts.select.ts) | TypeScript | 59 | 2 | 6 | 67 |
| [lib/services/scripts.service.ts](/lib/services/scripts.service.ts) | TypeScript | 509 | 57 | 160 | 726 |
| [lib/services/security.service.ts](/lib/services/security.service.ts) | TypeScript | 30 | 0 | 8 | 38 |
| [lib/services/versions.select.ts](/lib/services/versions.select.ts) | TypeScript | 9 | 0 | 0 | 9 |
| [lib/services/versions.service.ts](/lib/services/versions.service.ts) | TypeScript | 183 | 30 | 67 | 280 |
| [lib/supabase/storage.ts](/lib/supabase/storage.ts) | TypeScript | 15 | 0 | 1 | 16 |
| [lib/types/comment.ts](/lib/types/comment.ts) | TypeScript | 12 | 0 | 0 | 12 |
| [lib/types/contact.ts](/lib/types/contact.ts) | TypeScript | 8 | 0 | 0 | 8 |
| [lib/types/kit.ts](/lib/types/kit.ts) | TypeScript | 10 | 0 | 1 | 11 |
| [lib/types/resources.ts](/lib/types/resources.ts) | TypeScript | 16 | 0 | 1 | 17 |
| [lib/types/script.ts](/lib/types/script.ts) | TypeScript | 92 | 0 | 10 | 102 |
| [lib/types/version.ts](/lib/types/version.ts) | TypeScript | 9 | 0 | 0 | 9 |
| [lib/utils.ts](/lib/utils.ts) | TypeScript | 22 | 4 | 6 | 32 |
| [middleware.ts](/middleware.ts) | TypeScript | 12 | -1 | 7 | 18 |
| [package-lock.json](/package-lock.json) | JSON | 1,277 | 0 | 0 | 1,277 |
| [package.json](/package.json) | JSON | 3 | 0 | 0 | 3 |
| [sanity/schemaTypes/youTubeType/YouTubePreview.tsx](/sanity/schemaTypes/youTubeType/YouTubePreview.tsx) | TypeScript JSX | 21 | 1 | 4 | 26 |
| [sanity/schemaTypes/youTubeType/index.ts](/sanity/schemaTypes/youTubeType/index.ts) | TypeScript | -5 | 0 | 0 | -5 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details