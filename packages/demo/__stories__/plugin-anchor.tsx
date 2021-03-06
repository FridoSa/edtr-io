import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Anchor', module).add('Initial State', () => {
  const state = {
    plugin: 'anchor'
  }
  return <EditorStory initialState={state} />
})
