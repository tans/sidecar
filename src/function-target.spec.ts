#!/usr/bin/env ts-node
import { test }  from 'tstest'
import {
  addressTarget,
  agentTarget,
  exportTarget,
  TargetPayloadAddress,
  TargetPayloadAgent,
  TargetPayloadExport,
}                         from './function-target'

test('addressTarget()', async t => {
  const DATA     = 0x1234
  const EXPECTED: TargetPayloadAddress = {
    address    : '0x1234',
    moduleName : null,
    type       : 'address',
  }

  const result = addressTarget(DATA)

  t.deepEqual(result, EXPECTED, 'should get the correct address target for number')
})

test('addressTarget() with module', async t => {
  const DATA     = 0x1234
  const MODULE_NAME = 'myModule'
  const EXPECTED: TargetPayloadAddress = {
    address    : '0x1234',
    moduleName : MODULE_NAME,
    type       : 'address',
  }

  const result = addressTarget(DATA, MODULE_NAME)

  t.deepEqual(result, EXPECTED, 'should get the correct address target for number and module name')
})

test('agentTarget()', async t => {
  const DATA     = 'myPtr'
  const EXPECTED: TargetPayloadAgent = {
    type       : 'agent',
    varName    : DATA,
  }

  const result = agentTarget(DATA)

  t.deepEqual(result, EXPECTED, 'should get the correct agent target for var name')
})

test('exportTarget()', async t => {
  const DATA     = 'testExport'
  const EXPECTED: TargetPayloadExport = {
    exportName : DATA,
    moduleName   : null,
    type         : 'export',
  }

  const result = exportTarget(DATA)

  t.deepEqual(result, EXPECTED, 'should get the correct export target for number')
})

test('exportTarget() with export', async t => {
  const DATA     = 'testExport'
  const MODULE_NAME = 'myModule'
  const EXPECTED: TargetPayloadExport = {
    exportName : DATA,
    moduleName   : MODULE_NAME,
    type         : 'export',
  }

  const result = exportTarget(DATA, MODULE_NAME)

  t.deepEqual(result, EXPECTED, 'should get the correct export target for name and module name')
})
