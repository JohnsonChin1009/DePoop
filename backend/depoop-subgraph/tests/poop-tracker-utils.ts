import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { PoopEventLogged } from "../generated/PoopTracker/PoopTracker"

export function createPoopEventLoggedEvent(
  user: Address,
  cidHash: Bytes
): PoopEventLogged {
  let poopEventLoggedEvent = changetype<PoopEventLogged>(newMockEvent())

  poopEventLoggedEvent.parameters = new Array()

  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  poopEventLoggedEvent.parameters.push(
    new ethereum.EventParam("cidHash", ethereum.Value.fromFixedBytes(cidHash))
  )

  return poopEventLoggedEvent
}
