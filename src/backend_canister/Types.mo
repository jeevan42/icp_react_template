// Importing the List module from the base library
import List "mo:base/List";

module {
    // Defining custom types
    public type HexCode = Text;
    public type UserIdentity = Principal;
    public type EventName = Text;
    public type EventDes = Text;
    public type Time = Text;
    public type EventId = Text;
    public type OwnerId = Text;

    // Defining the EventInfo type
    public type EventInfo = {
        name : EventName;
        description : EventDes;
        startTime : Time;
        endTime : Time;
    };

    // Defining the SeatInfo type
    public type SeatInfo = {
        hexCode : HexCode;
        seatNo : Nat;
    };
    public type QrData = {
        generatedQr : [HexCode];
        totalQrGenerated : Nat;
    };
    // Defining the EventData type
    public type EventData = {
        claimedSeats : [(UserIdentity, SeatInfo)];
        qrData : QrData;
    };

    // Defining the EventMetaData type
    public type EventMetaData = {
        eventInfo : EventInfo;
        eventData : EventData;
        changeStatus : Bool;
    };
};
