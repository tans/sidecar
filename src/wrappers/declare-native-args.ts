import { SidecarMetadataFunctionDescription } from '../decorators/mod'

import {
  argName,
  bufName,
  nativeArgName,
}                 from './name-helpers'

function declareNativeArgs (this: SidecarMetadataFunctionDescription) {
  const name          = this.name
  const paramTypeList = this.paramTypeList

  /**
   * There's no any parameters needed
   */
  if (!Array.isArray(paramTypeList)) {
    return ''
  }

  const declareStatementList = []
  for (const [argIdx, paramTypeChain] of paramTypeList.entries()) {
    const [nativeType, ...pointerTypeList] = paramTypeChain
    // console.log(argIdx, nativeType, pointerTypeList)

    const statementChain = []

    /**
     * Current arg is non-pointer
     */
    if (nativeType !== 'pointer') {
      statementChain.push(
        '',
        `// non-pointer type for arg[${argIdx}]: ${nativeType}`,
        `const ${nativeArgName(name, argIdx)} = ${argName(argIdx)}`,
      )
      declareStatementList.push(statementChain.join('\n  '))
      continue
    }

    /**
     * Current arg is a native pointer
     */
    statementChain.push(
      '',
      `// pointer type for arg[${argIdx}] -> ${pointerTypeList.join(' -> ')}`,
      // FIXME: Huan(202106) how to get the size? (1024)
      `const ${nativeArgName(name, argIdx)} = Memory.alloc(1024 /*Process.pointerSize*/)`,
    )
    let lastVarName: string = nativeArgName(name, argIdx)

    for (const [typeIdx, pointerType] of pointerTypeList.entries()) {
      if (pointerType === 'Pointer') {

        statementChain.push(
          '',
          `const ${bufName(name, argIdx, typeIdx)} = Memory.alloc(Process.pointerSize)`,
          `${lastVarName}.writePointer(${bufName(name, argIdx, typeIdx)})`
        )

        lastVarName = bufName(name, argIdx, typeIdx)
      } else {

        /**
         * Best Practices: String allocation (UTF-8/UTF-16/ANSI)
         *  https://frida.re/docs/best-practices/
         *
         * Huan(202106) FIXME: alloc memory for string before assign to native argumenments
         */
        statementChain.push(
          '',
          `${lastVarName}.write${pointerType}(${argName(argIdx)})`,
        )

      }
    }

    declareStatementList.push(statementChain.join('\n  '))
  }

  return declareStatementList.join('\n\n')
}

export { declareNativeArgs }