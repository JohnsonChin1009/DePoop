import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { PoopEventLogged } from "../generated/PoopTracker/PoopTracker"

export function createPoopEventLoggedEvent(
  user: Address,
  latitude: i32,
  longitude: i32,
  timestamp: BigInt,
  sessionDuration: i32
): PoopEventLogged {
  let poopEventLoggedEvent = changetype<PoopEventLogged>(newMockEvent())

  poopEventLoggedEvent.parameters = new Array()

  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam("latitude", ethereum.Value.fromI32(latitude))
  )
  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam("longitude", ethereum.Value.fromI32(longitude))
  )
  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionDuration",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(sessionDuration))
    )
  )

  return poopEventLoggedEvent
}
