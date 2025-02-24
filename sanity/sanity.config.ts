import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { codeInput } from '@sanity/code-input'
import {youtubeInput} from 'sanity-plugin-youtube-input';
import { seoMetaFields} from "sanity-plugin-seo";
import {media} from 'sanity-plugin-media';

const googleApiKey = String(process.env.GOOGLE_API_KEY);

export default defineConfig({
  name: 'default',
  title: 'bimformative',

  projectId: 'wlb0lt21',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput(), youtubeInput({apiKey: 'AIzaSyChKSvtAayBfwajDrv22s9cWj2IxpulL5Q'}), seoMetaFields(), media()],

  schema: {
    types: schemaTypes,
  },
})
