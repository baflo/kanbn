interface UtilityFunctions {
    [k: string]: (...args: any) => any
}

declare const utilityFunctions: UtilityFunctions;

export default utilityFunctions;