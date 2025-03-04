import { type DependencyList, useCallback, useLayoutEffect, useState } from "react"

/**
 * Promise hook with dependencies
 * 
 * @returns
 */
export default function usePromise<Solve, Data extends unknown[]>(executor: ExecuteWithDependencies<Solve, Data>, dependencies: DependencyList): PromiseWithDependencies<Solve, Data>

/**
 * Promise hook without dependencies
 * 
 * @returns
 */
export default function usePromise<Solve, Data extends unknown[]>(executor: ExecuteWithoutDependencies<Solve, Data>): PromiseWithoutDependencies<Solve, Data>

/**
 * Promise hook
 * 
 * @returns 
 */
export default function usePromise<Solve, Data extends unknown[]>(executor: ExecuteWithDependencies<Solve, Data>, dependencies?: DependencyList) {

    /**
     * Exception state
     * 
     */
    const [exception, setException] = useState<Reference<unknown> | undefined>(undefined)

    /**
     * Solve state
     * 
     */
    const [solve, setSolve] = useState<Reference<Solve> | undefined>(undefined)

    /**
     * Pending state
     * 
     */
    const [pending, setPending] = useState<boolean>(false)

    /**
     * Reset method
     * 
     * @returns
     */
    const reset = useCallback(function () {

        // Reset exception state
        setException(undefined)

        // Reset solve state
        setSolve(undefined)

    }, [])

    /**
     * Dispatch method
     * 
     * @returns
     */
    const dispatch: Update<Solve> = useCallback(function (value) {

        // Check solve
        if (!solve) throw new Error("You can't direct update solve before promise resolve")

        setSolve({ current: update(value, solve.current) })

    }, [solve])

    /**
     * Execute method
     * 
     * @returns
     */
    const execute: ExecuteWithDependencies<Promise<Solve>, Data> = useCallback(async function (...data) {

        // Reset solve & exception
        reset()

        // Start pending
        setPending(true)

        try {

            // Execute executor
            const solve = await executor(...data)

            // Set solve
            setSolve({ current: solve })

            return solve

        } catch (exception) {

            // Set exception
            setException({ current: exception })

            // Throw exception
            throw exception

        } finally {

            // Stop pending
            setPending(false)
        }

    }, [executor])

    /**
     * Safe execute method
     * 
     * @returns
     */
    const safeExecute: ExecuteWithDependencies<Promise<Solve | undefined>, Data> = useCallback(async function (...data) {

        try {

            return await execute(...data)
        }

        catch {

            return undefined
        }

    }, [execute])

    /**
     * Layout Effect
     * 
     */
    useLayoutEffect(function () {

        // Execute
        if (dependencies) safeExecute()

    }, dependencies || [])

    /**
     * Solve status
     * 
     */
    const solveStatus = solve ? { solve: solve.current, pending: false } : undefined

    /**
     * Exception status
     * 
     */
    const exceptionStatus = exception ? { exception, pending: false } : undefined

    /**
     * Pending status
     * 
     */
    const pendingStatus = { pending: true }

    /**
     * With dependencies
     * 
     */
    const withDependencies = solveStatus || exceptionStatus || pendingStatus

    /**
     * Without dependencies
     * 
     */
    const withoutDependencies = { pending, solve, exception, reset }

    /**
     * Promise
     * 
     */
    const promise = dependencies ? withDependencies : withoutDependencies

    return { ...promise, execute, safeExecute, dispatch }
}

/**
 * Update method
 * 
 * @returns
 */
export function update<Target>(value: UpdateValue<Target>, old: Target): Target {

    // If value is callback called by old value
    return value instanceof Function ? value(old) : value
}

/**
 * Update value
 * 
 */
export type UpdateValue<Target> = Target | ((value: Target) => Target)

/**
 * Update
 * 
 */
export type Update<Target> = (value: UpdateValue<Target>) => void

/**
 * Execute with dependencies
 * 
 */
export type ExecuteWithDependencies<Solve, Data extends unknown[]> = (...data: { [Key in keyof Data]?: Data[Key] | undefined }) => Solve

/**
 * Execute without dependencies
 * 
 */
export type ExecuteWithoutDependencies<Solve, Data extends unknown[]> = (...data: Data) => Solve

/**
 * Reset
 * 
 */
export type Reset = () => void

/**
 * Promise with dependencies
 * 
 */
export type PromiseWithDependencies<Solve, Data extends unknown[] = []> = (SolveStatus<Solve> | ExceptionStatus | PendingStatus) & {
    safeExecute: ExecuteWithDependencies<Promise<Awaited<Solve | undefined>>, Data>
    execute: ExecuteWithDependencies<Promise<Awaited<Solve>>, Data>
    dispatch: Update<Awaited<Solve>>
}

/**
 * Solve status
 * 
 */
export interface SolveStatus<Solve> {
    solve: Awaited<Solve>
    exception: undefined
    pending: false
}

/**
 * Exception status
 * 
 */
export interface ExceptionStatus {
    exception: Reference<unknown>
    solve: undefined
    pending: false
}

/**
 * Pending status
 * 
 */
export interface PendingStatus {
    exception: undefined
    solve: undefined
    pending: true
}

/**
 * Promise without dependencies
 * 
 */
export type PromiseWithoutDependencies<Solve, Data extends unknown[] = []> = {
    safeExecute: ExecuteWithoutDependencies<Promise<Awaited<Solve | undefined>>, Data>
    execute: ExecuteWithoutDependencies<Promise<Awaited<Solve>>, Data>
    solve: Reference<Awaited<Solve>> | undefined
    exception: Reference<unknown> | undefined
    dispatch: Update<Solve>
    pending: boolean
    reset: Reset
}

/**
 * Reference
 * 
 */
export interface Reference<Target> {
    current: Target
}