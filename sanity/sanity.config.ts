import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { codeInput } from '@sanity/code-input'
import {youtubeInput} from 'sanity-plugin-youtube-input';

export default defineConfig({
  name: 'default',
  title: 'bimformative',

  projectId: 'wlb0lt21',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput(), youtubeInput({apiKey: 'AIzaSyBQv1wtnwx-pkjvrQNQSFLuhDSLRVOBsbY'})],

  schema: {
    types: schemaTypes,
  },
})
