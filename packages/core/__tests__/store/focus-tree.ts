import { plugins } from '../../__fixtures__/plugins'
import {
  getFocusTree,
  Node,
  findNextNode,
  findPreviousNode
} from '../../src/store/focus-tree'
import { ActionType, BaseState, State, reducer } from '../../src/store'

let state: State

beforeEach(() => {
  state = createInitialState({
    defaultPlugin: 'default',
    plugins,
    documents: {}
  })
})

describe('getFocusTree', () => {
  test('empty tree initially', () => {
    state = reducer(state, {
      type: ActionType.InitRoot,
      payload: {
        plugin: 'stateless',
        id: '0'
      }
    })
    expect(getFocusTree(state)).toEqual({
      id: 'root'
    })
  })

  test('height 1', () => {
    state = reducer(state, {
      type: ActionType.InitRoot,
      payload: {
        plugin: 'nestedArray',
        state: {
          children: [
            { plugin: 'stateful', state: 0 },
            { plugin: 'stateful', state: 1 },
            { plugin: 'stateful', state: 2 },
            { plugin: 'stateful', state: 3 }
          ]
        }
      }
    })

    const tree = getFocusTree(state)

    if (!tree) {
      throw new Error('Expected tree')
    }

    expect(tree.children).toHaveLength(4)
  })

  test('blockquote in rows', () => {
    state = reducer(state, {
      type: ActionType.InitRoot,
      payload: {
        plugin: 'rows',
        state: [{ plugin: 'blockquote', state: { plugin: 'text' } }]
      }
    })

    const tree = getFocusTree(state)

    if (!tree) {
      throw new Error('Expected tree')
    }

    if (!tree.children) {
      throw new Error('Expected children')
    }

    expect(tree.children[0].children).toHaveLength(1)
  })
})

describe('findNextNode', () => {
  const root: Node = {
    id: 'root',
    children: [
      {
        id: 'root.0',
        children: [{ id: 'root.0.0' }, { id: 'root.0.1' }, { id: 'root.0.2' }]
      },
      {
        id: 'root.1',
        children: [{ id: 'root.1.0' }, { id: 'root.1.1' }, { id: 'root.1.2' }]
      },
      {
        id: 'root.0',
        children: [{ id: 'root.2.0' }, { id: 'root.2.1' }, { id: 'root.2.2' }]
      }
    ]
  }

  test('same parent', () => {
    const next = findNextNode(root, 'root.0.0')

    if (!next) {
      throw new Error('Expected to find node')
    }

    expect(next).toEqual('root.0.1')
  })

  test('one level parent', () => {
    const next = findNextNode(root, 'root.0.2')

    if (!next) {
      throw new Error('Expected to find node')
    }

    expect(next).toEqual('root.1.0')
  })

  test('last node', () => {
    const next = findNextNode(root, 'root2.2')
    expect(next).toBeNull()
  })

  test('inner node', () => {
    const next = findNextNode(root, 'root.0')

    if (!next) {
      throw new Error('Expected to find node')
    }

    expect(next).toEqual('root.1.0')
  })

  test('wrap around bug (height 1)', () => {
    const next = findNextNode(
      {
        id: 'root',
        children: [{ id: 'root.0' }, { id: 'root.1' }]
      },
      'root.1'
    )
    expect(next).toBeNull()
  })
})

describe('findPreviousNode', () => {
  const root: Node = {
    id: 'root',
    children: [
      {
        id: 'root.0',
        children: [{ id: 'root.0.0' }, { id: 'root.0.1' }, { id: 'root.0.2' }]
      },
      {
        id: 'root.1',
        children: [{ id: 'root.1.0' }, { id: 'root.1.1' }, { id: 'root.1.2' }]
      },
      {
        id: 'root.0',
        children: [{ id: 'root.2.0' }, { id: 'root.2.1' }, { id: 'root.2.2' }]
      }
    ]
  }

  test('same parent', () => {
    const previous = findPreviousNode(root, 'root.0.1')

    if (!previous) {
      throw new Error('Expected to find node')
    }

    expect(previous).toEqual('root.0.0')
  })

  test('one level parent', () => {
    const previous = findPreviousNode(root, 'root.1.0')

    if (!previous) {
      throw new Error('Expected to find node')
    }

    expect(previous).toEqual('root.0.2')
  })

  test('fist node', () => {
    const previous = findPreviousNode(root, 'root0.0')
    expect(previous).toBeNull()
  })

  test('inner node', () => {
    const previous = findPreviousNode(root, 'root.1')

    if (!previous) {
      throw new Error('Expected to find node')
    }

    expect(previous).toEqual('root.0.2')
  })
})

function createInitialState(baseState: BaseState): State {
  return {
    ...baseState,
    history: {
      initialState: baseState,
      actions: [],
      redoStack: [],
      pending: 0
    },
    clipboard: [],
    editable: true
  }
}
