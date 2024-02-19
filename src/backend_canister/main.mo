/*
This file contains the implementation of the main actor class for the attendance proof system backend.
It imports various base libraries and a custom Types module.
The actor class provides functions for creating, editing, and deleting events, generating QR codes, validating user QR codes,
managing event ownership, and retrieving event information.
*/

import List "mo:base/List";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Timer "mo:base/Timer";
import Random "mo:base/Random";
import Error "mo:base/Error";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import { now } "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";

import Types "Types";
import Utils "./Utils";

shared ({ caller = owner }) actor class () {
  // Class variables
  stable var entries : [(Types.EventId, Types.EventMetaData)] = [];
  var eventMap = HashMap.HashMap<Types.EventId, Types.EventMetaData>(0, Text.equal, Text.hash);
  stable var eventIds = List.nil<Types.EventId>();
  stable var ownerArray : [Types.OwnerId] = [];
  var hexCode = "";

  public shared ({ caller }) func createEvent(eventInfo : Types.EventInfo) : async Text {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("No Access");
    };

    // Generate a unique event ID
    let eventId : Text = Text.toLowercase(Text.replace(eventInfo.name, #char ' ', "")) # Int.toText(now());

    // Update the list of event IDs
    eventIds := List.push(eventId, eventIds);

    // Create the event data and metadata
    let qrData = {
      generatedQr = [];
      totalQrGenerated = 0;
    };
    let eventData : Types.EventData = {
      claimedSeats = [];
      qrData;
    };

    let event : Types.EventMetaData = {
      eventInfo;
      eventData;
      changeStatus = false;
    };

    // Add the event to the event map
    eventMap.put(eventId, event);

    "Successfully created Event";
  };

  // Function: editEvent
  // Edits the event with the provided event ID, updating the event information.
  public shared ({ caller }) func editEvent(eventId : Types.EventId, eventInfo : Types.EventInfo) : async Text {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("No Access");
    };

    let eventMetaData : Types.EventMetaData = Utils.getEventMetaData(eventId, eventMap);
    // Retrieve the existing event metadata

    // Update the event metadata with the new event information
    let updatedEventMetaData : Types.EventMetaData = {
      eventInfo;
      eventData = eventMetaData.eventData;
      changeStatus = eventMetaData.changeStatus;
    };

    // Replace the existing event metadata with the updated event metadata
    ignore eventMap.replace(eventId, updatedEventMetaData);

    "Successfully updated Event";
  };

  // Function: deleteEvent
  // Deletes the event with the provided event ID.
  public shared ({ caller }) func deleteEvent(eventId : Types.EventId) : async Text {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("No Access");
    };

    // Remove the event from the event map
    switch (eventMap.remove(eventId)) {
      case (null) { Debug.trap("No event with the given ID exists") };
      case (?r) {
        ignore r;
        "Successfully deleted event";
      };
    };
  };

  // Function: getQrCode
  // Generates and returns a QR code for the event with the provided event ID.
  public shared ({ caller }) func getQrCode(eventId : Types.EventId) : async Types.HexCode {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("No Access");
    };

    // Retrieve the event metadata
    let eventMetaData : Types.EventMetaData = Utils.getEventMetaData(eventId, eventMap);

    // Check if the event is within the valid time range
    Utils.checkTime(eventMetaData, eventMap);

    // If the QR code generation status is not changed, return the existing QR code
    if (eventMetaData.changeStatus == false) {
      return hexCode;
    };

    // Generate a new QR code
    hexCode := Int.toText(now());
    Debug.print(debug_show (hexCode));

    // Update the event metadata with the new QR code
    let eventInfo = {
      name = eventMetaData.eventInfo.name;
      description = eventMetaData.eventInfo.description;
      startTime = eventMetaData.eventInfo.startTime;
      endTime = eventMetaData.eventInfo.endTime;
    };
    let qrData = {
      generatedQr = List.toArray(List.push(hexCode, List.fromArray(eventMetaData.eventData.qrData.generatedQr)));
      totalQrGenerated = eventMetaData.eventData.qrData.totalQrGenerated + 1;
    };
    let eventData = {
      claimedSeats = eventMetaData.eventData.claimedSeats;
      qrData;
    };

    let event : Types.EventMetaData = {
      eventInfo;
      eventData;
      changeStatus = false;
    };

    eventMap.put(eventId, event);

    hexCode;
  };

  // Function: changeQrGenerateStatus
  // Changes the QR code generation status for the event with the provided event ID.
  public shared ({ caller }) func changeQrGenerateStatus(eventId : Types.EventId) : async () {
    // Access control check

    if (Principal.isAnonymous(caller) == false and Utils.getOwnerFromArray(caller, ownerArray) == false) {

      Debug.trap("Not Authorized");
    };

    // Retrieve the event metadata
    let eventMetaData : Types.EventMetaData = Utils.getEventMetaData(eventId, eventMap);

    // Update the event metadata to change the QR code generation status
    let eventInfo = {
      name = eventMetaData.eventInfo.name;
      description = eventMetaData.eventInfo.description;
      startTime = eventMetaData.eventInfo.startTime;
      endTime = eventMetaData.eventInfo.endTime;
    };

    let qrData = {
      generatedQr = eventMetaData.eventData.qrData.generatedQr;
      totalQrGenerated = eventMetaData.eventData.qrData.totalQrGenerated;
    };
    let eventData = {
      claimedSeats = eventMetaData.eventData.claimedSeats;
      qrData;
    };

    let event : Types.EventMetaData = {
      eventInfo;
      eventData;
      changeStatus = true;
    };

    ignore eventMap.replace(eventId, event);
  };

  // Function: validateUserQrCode
  // Validates the user's QR code for the event with the provided event ID.
  public shared ({ caller }) func validateUserQrCode(eventId : Types.EventId, qrCode : Types.HexCode) : async Text {
    // Retrieve the event metadata
    let eventMetaData : Types.EventMetaData = Utils.getEventMetaData(eventId, eventMap);

    // Create a HashMap to store the claimed seats
    var map = HashMap.HashMap<Types.UserIdentity, Types.SeatInfo>(0, Principal.equal, Principal.hash);
    var qrLeft : [Types.HexCode] = [];
    // Check if the QR code is valid
    switch (Array.find<Types.HexCode>(eventMetaData.eventData.qrData.generatedQr, func n { n == qrCode })) {
      case (null) { Debug.trap("Invalid QR code") };
      case (?r) {
        qrLeft := Array.filter<Types.HexCode>(eventMetaData.eventData.qrData.generatedQr, func x = x != qrCode);
        map := HashMap.fromIter<Types.UserIdentity, Types.SeatInfo>(eventMetaData.eventData.claimedSeats.vals(), Array.size(eventMetaData.eventData.claimedSeats), Principal.equal, Principal.hash);
      };
    };

    // Create the seat information for the user
    let seatInfo : Types.SeatInfo = {
      hexCode = qrCode;
      seatNo = map.size() + 1;
    };

    // Check if the user already exists in the claimed seats map
    switch (map.get(caller)) {
      case (?value) { Debug.trap("User already exists!") };
      case (null) {
        map.put(caller, seatInfo);
      };
    };
    // Update the QR data with the remaining generated QR codes
    let qrData = {
      generatedQr = qrLeft;
      totalQrGenerated = eventMetaData.eventData.qrData.totalQrGenerated;
    };
    // Update the event data with the new claimed seats information
    let eventData : Types.EventData = {
      claimedSeats = Iter.toArray(map.entries());
      qrData;
    };

    // Update the event metadata with the new event data
    let updatedEventMetaData : Types.EventMetaData = {
      eventInfo = eventMetaData.eventInfo;
      eventData;
      changeStatus = eventMetaData.changeStatus;
    };

    // Update the event map with the updated event metadata
    eventMap.put(eventId, updatedEventMetaData);

    "Successfully updated validated";
  };

  // Function: isAdmin
  // Checks if the caller is an admin.
  public shared query ({ caller }) func isAdmin() : async Bool {
    switch (Array.find<Types.OwnerId>(ownerArray, func(x) : Bool { x == Principal.toText(caller) })) {
      case (null) { false };
      case (?r) { true };
    };
  };

  // Function: getEvent
  // Retrieves the event metadata for the event with the provided event ID.
  public shared query ({ caller }) func getEvent(eventId : Types.EventId) : async Types.EventMetaData {
    switch (eventMap.get(eventId)) {
      case (null) { Debug.trap("No event found with the given ID") };
      case (?r) { r };
    };
  };

  // Function: getUserSeat
  // Retrieves the seat information for the user in the event with the provided event ID.
  public shared query ({ caller = user }) func getUserSeat(eventId : Types.EventId) : async Types.SeatInfo {
    // Create a HashMap to store the claimed seats
    var claimedSeats = HashMap.HashMap<Types.UserIdentity, Types.SeatInfo>(0, Principal.equal, Principal.hash);

    // Retrieve the event metadata
    let eventMetaData : Types.EventMetaData = Utils.getEventMetaData(eventId, eventMap);

    // Check if the event is within the valid time range
    Utils.checkTime(eventMetaData, eventMap);

    // Retrieve the claimed seats for the event
    let userIdSeatInfoArray : [(Types.UserIdentity, Types.SeatInfo)] = eventMetaData.eventData.claimedSeats;

    // Convert the claimed seats array to a HashMap
    claimedSeats := HashMap.fromIter<Types.UserIdentity, Types.SeatInfo>(userIdSeatInfoArray.vals(), Array.size(userIdSeatInfoArray), Principal.equal, Principal.hash);

    // Retrieve the seat information for the user
    switch (claimedSeats.get(user)) {
      case (null) { Debug.trap("No seat found") };
      case (?r) { return r };
    };
  };

  // Function: getEventIds
  // Retrieves the list of event IDs.
  public shared query ({ caller }) func getEventIds() : async [Types.EventId] {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("No Access");
    };

    // Convert the event IDs list to an array
    List.toArray(eventIds);
  };

  // Function: getAllEvent
  // Retrieves all the events and their metadata.
  public shared query ({ caller }) func getAllEvent() : async [(Types.EventId, Types.EventMetaData)] {
    // Access control check
    if (Utils.getOwnerFromArray(caller, ownerArray) == false) {
      Debug.trap("Not Authorized");
    };

    // Convert the event map entries to an array
    Iter.toArray(eventMap.entries());
  };

  // Function: addOwner
  // Adds an owner to the ownerArray.
  public shared ({ caller }) func addOwner(ownerIds : Types.OwnerId) : async Text {
    // Access control check
    if (caller == owner) {
      let list = List.push(ownerIds, List.fromArray(ownerArray));
      ownerArray := List.toArray(list);
      "Successfully inserted data";
    } else {
      Debug.trap("No Access to Add Owner");
    };
  };

  // Function: getTime
  // Retrieves the current time.
  public func getTime() : async Int {
    now();
  };

  // Function: getOwner
  // Retrieves the owner of the actor class.
  public query func getOwner() : async Principal {
    owner;
  };

  // Function: preupgrade
  // Pre-upgrade hook to store the current state of the actor class.
  system func preupgrade() {
    entries := Iter.toArray(eventMap.entries());
  };

  // Function: postupgrade
  // Post-upgrade hook to restore the state of the actor class after an upgrade.
  system func postupgrade() {
    eventMap := HashMap.fromIter<Types.EventId, Types.EventMetaData>(entries.vals(), entries.size(), Text.equal, Text.hash);
    entries := [];
  };
};
