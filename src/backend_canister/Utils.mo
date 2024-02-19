import Types "Types";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import { now } "mo:base/Time";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

module {
    // Function: createEvent
    // Creates a new event with the provided event information.
    public func getEventMetaData(eventId : Types.EventId, eventMap : HashMap.HashMap<Types.EventId, Types.EventMetaData>) : Types.EventMetaData {
        let eventMetaData : Types.EventMetaData = switch (eventMap.get(eventId)) {
            case (null) {
                Debug.trap("No event with the given ID exists: " # eventId);
            };
            case (?r) { r };
        };
    };

    // Function: checkTime
    // Checks if the event is within the valid time range.
    public func checkTime(eventMetaData : Types.EventMetaData, eventMap : HashMap.HashMap<Types.EventId, Types.EventMetaData>) {
        if (eventMetaData.eventInfo.startTime >= Int.toText(now())) {
            Debug.trap("Event is yet to start!");
        };
        if (eventMetaData.eventInfo.endTime <= Int.toText(now())) {
            Debug.trap("Event is over!");
        };
    };

    // Function: getOwnerFromArray
    // Checks if the caller is an owner.
    public func getOwnerFromArray(caller : Principal, ownerArray : [Types.OwnerId]) : Bool {
        switch (Array.find<Text>(ownerArray, func(x) : Bool { x == Principal.toText(caller) })) {
            case (null) { false };
            case (?r) {
                true;
            };
        };
    };
};
