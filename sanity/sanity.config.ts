import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { codeInput } from '@sanity/code-input'
import {youtubeInput} from 'sanity-plugin-youtube-input';

const googleApiKey = process.env.GOOGLE_API_KEY || '';

export default defineConfig({
  name: 'default',
  title: 'bimformative',

  projectId: 'wlb0lt21',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput(), youtubeInput({apiKey: googleApiKey})],

  schema: {
    types: schemaTypes,
  },
})
