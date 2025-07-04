import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Hash "mo:base/Hash";

actor {
  public type LogId = Nat;

  public type PlantLog = {
    id : LogId;
    plantName : Text;
    plantDate : Text;
    statusNote : Text;
    imageUrl : Text;
    createdAt : Time.Time
  };

  private stable var nextId : LogId = 0;
  private stable var stableLogs : [(LogId, PlantLog)] = [];

  private var logs = HashMap.fromIter<LogId, PlantLog>(
    stableLogs.vals(),
    10,
    Nat.equal,
    Hash.hash
  );

  // Create
  public func addLog(
    plantName : Text,
    plantDate : Text,
    statusNote : Text,
    imageUrl : Text
  ) : async LogId {
    let id = nextId;
    let log : PlantLog = {
      id = id;
      plantName = plantName;
      plantDate = plantDate;
      statusNote = statusNote;
      imageUrl = imageUrl;
      createdAt = Time.now()
    };
    logs.put(id, log);
    nextId += 1;
    return id
  };

  // Read
  public query func getAllLogs() : async [PlantLog] {
    Iter.toArray(logs.vals())
  };

  // Update
  public func editLog(
    id : LogId,
    plantName : Text,
    plantDate : Text,
    statusNote : Text,
    imageUrl : Text
  ) : async Bool {
    switch (logs.get(id)) {
      case null {false};
      case (?log) {
        logs.put(
          id,
          {
            id = log.id;
            plantName = plantName;
            plantDate = plantDate;
            statusNote = statusNote;
            imageUrl = imageUrl;
            createdAt = log.createdAt
          }
        );
        true
      }
    }
  };

  // Delete
  public func deleteLog(id : LogId) : async Bool {
    logs.remove(id) != null
  };

  system func preupgrade() {
    stableLogs := Iter.toArray(logs.entries())
  };

  system func postupgrade() {
    stableLogs := []
  }
}
