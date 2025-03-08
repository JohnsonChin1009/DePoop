import { PoopEventLogged as PoopEventLoggedEvent } from "../generated/PoopTracker/PoopTracker"
import { PoopEventLogged } from "../generated/schema"

export function handlePoopEventLogged(event: PoopEventLoggedEvent): void {
  let entity = new PoopEventLogged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.cidHash = event.params.cidHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
