import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { PoopEventLogged } from "../generated/schema"
import { PoopEventLogged as PoopEventLoggedEvent } from "../generated/PoopTracker/PoopTracker"
import { handlePoopEventLogged } from "../src/poop-tracker"
import { createPoopEventLoggedEvent } from "./poop-tracker-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let latitude = 123
    let longitude = 123
    let timestamp = BigInt.fromI32(234)
    let sessionDuration = 123
    let newPoopEventLoggedEvent = createPoopEventLoggedEvent(
      user,
      latitude,
      longitude,
      timestamp,
      sessionDuration
    )
    handlePoopEventLogged(newPoopEventLoggedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("PoopEventLogged created and stored", () => {
    assert.entityCount("PoopEventLogged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PoopEventLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PoopEventLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "latitude",
      "123"
    )
    assert.fieldEquals(
      "PoopEventLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "longitude",
      "123"
    )
    assert.fieldEquals(
      "PoopEventLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )
    assert.fieldEquals(
      "PoopEventLogged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sessionDuration",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
