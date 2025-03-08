import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { PoopEventLogged } from "../generated/schema"
import { PoopEventLogged as PoopEventLoggedEvent } from "../generated/PoopTracker/PoopTracker"
import { handlePoopEventLogged } from "../src/poop-tracker"
import { createPoopEventLoggedEvent } from "./poop-tracker-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let cidHash = Bytes.fromI32(1234567890)
    let newPoopEventLoggedEvent = createPoopEventLoggedEvent(user, cidHash)
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
      "cidHash",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
