import { PoopEventLogged as PoopEventLoggedEvent } from '../generated/PoopTracker/PoopTracker';
import { PoopEventLogged } from '../generated/schema';

export function handlePoopEventLogged(event: PoopEventLoggedEvent): void {
  const entity = new PoopEventLogged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.latitude = event.params.latitude;
  entity.longitude = event.params.longitude;
  entity.timestamp = event.params.timestamp;
  entity.sessionDuration = event.params.sessionDuration;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
