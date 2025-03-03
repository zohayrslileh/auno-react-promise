# @auno/react-promise
A powerful React hook for managing asynchronous operations with built-in loading and error states.

## Features

- ⚡ Automatic and manual execution modes
- 🔄 Built-in loading state management
- 🛡️ Comprehensive error handling
- 📦 Type-safe promise handling
- 🔄 State updates through dispatch
- 🎯 Dependency-based auto-execution
- 💫 Clean and predictable state management
- 🚀 Zero dependencies

## Installation

#### npm
```bash
npm install @auno/react-promise
```

#### yarn
```bash
yarn add @auno/react-promise
```

#### pnpm
```bash
pnpm add @auno/react-promise
```

#### bun
```bash
bun add @auno/react-promise
```

## Usage

### Auto-Execute Mode (based dependencies)
```tsx
import usePromise from "@auno/react-promise"

export function RandomUser() {

    const randomuser = usePromise(async function () {
        const response = await fetch("https://randomuser.me/api/")
        return await response.json()
    }, []) // Will execute on mount

    if (randomuser.pending) return <i>Loading...</i>

    if (randomuser.exception) return <b>{String(randomuser.exception.current)}</b>

    return (
        <div>
            <pre>{JSON.stringify(randomuser.solve, null, 4)}</pre>
            <button onClick={randomuser.safeExecute}>Reload</button>
        </div>
    )
}
```

### Manual Execute Mode
```tsx
import usePromise from "@auno/react-promise"

export function RandomUser() {

    const randomuser = usePromise(async function () {
        const response = await fetch("https://randomuser.me/api/")
        return await response.json()
    }) // Won't execute automatically

    if (randomuser.pending) return <i>Loading...</i>

    if (randomuser.exception) return <b>{String(randomuser.exception.current)}</b>

    if (!randomuser.solve) return <button onClick={randomuser.safeExecute}>Get random user</button>

    return (
        <div>
            <pre>{JSON.stringify(randomuser.solve.current, null, 4)}</pre>
            <button onClick={randomuser.safeExecute}>Get other user</button>
        </div>
    )
}
```

### With Parameters
```tsx
import usePromise from "@auno/react-promise"

export function Nationalize() {

    const nationalize = usePromise(async function (name = "nathaniel") {
        const response = await fetch(`https://api.nationalize.io/?name=${name}`)
        return await response.json()
    }, []) // Execute with initial parameter

    if (nationalize.pending) return <i>Loading...</i>

    if (nationalize.exception) return <b>{String(nationalize.exception.current)}</b>

    return (
        <div>
            <pre>{JSON.stringify(nationalize.solve, null, 4)}</pre>
            <button onClick={() => nationalize.safeExecute("morgan")}>Try different name</button>
        </div>
    )
}
```

## Features Explanation

### Automatic Execution
When dependencies are provided, the promise automatically executes when the component mounts or when dependencies change, also you can manual execution.

### Manual Execution
Without dependencies, you have full control over when the promise executes using `execute` or `safeExecute`.

### State Management
- `pending`: Tracks loading state
- `solve`: Stores successful results
- `exception`: Captures errors
- `reset`: Reset all states

### Safe Execution
`safeExecute` method prevents uncaught promise rejections and returns undefined on error.

### State Updates
`dispatch` function allows updating the solved value directly:
```typescript
// Direct value update
dispatch(newValue)

// Functional update
dispatch(prev => computeNew(prev))
```

## TypeScript Support
Fully written in TypeScript with complete type definitions.

## License
MIT

## Author
zohayrslileh - [GitHub](https://github.com/zohayrslileh/auno-react-promise)