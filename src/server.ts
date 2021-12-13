import {delay} from "lodash";
import {APIUser, WorkoutStat} from "sdk-library";
import WS from "ws";
import {initApp} from "./app";

//
//  Interfaces
//

//  Generic

export interface Message {
  type: string;
  user?: APIUser;
}

//  Online Members

export const ONLINE_MEMBERS_MESSAGE_TYPE = "online-members";
export interface OnlineMembersMessage extends Message {
  type: typeof ONLINE_MEMBERS_MESSAGE_TYPE;
  members: string[];
}

export const REGISTER_MEMBER_MESSAGE_TYPE = "register-member";
export interface RegisterMemberMessage extends Message {
  type: typeof REGISTER_MEMBER_MESSAGE_TYPE;
}

export const UNREGISTER_MEMBER_MESSAGE_TYPE = "unregister-member";
export interface UnRegisterMemberMessage extends Message {
  type: typeof UNREGISTER_MEMBER_MESSAGE_TYPE;
}

//  Video Streaming
export interface OfferMessage extends Message {
  type: "offer";
  offer: RTCSessionDescription;
}

export interface ActiveHostsMessage extends Message {
  type: "active-hosts";
  announcements: HostAnnouncementMessage[];
}

export interface HostAnnouncementMessage extends Message {
  type: "host-announcement";
}

export const HOST_CLOSE_MESSAGE_TYPE = "host-close";
export interface HostCloseMessage extends Message {
  type: typeof HOST_CLOSE_MESSAGE_TYPE;
}

export interface NewSubscriberMessage extends Message {
  type: "new-subscriber";
}

//  NOTE:  FOR NOW, we just broadcast the simple data given a race (Workout ID)!
//         We should ONLY broadcast to clients who KNOW the Workout ID.  The knowledge of this ID is their "password".

//  Workout Client Map
const workoutClientMap: {[workoutId: string]: WS[]} = {};

const clients: any[] = [];

//  TODO:  In the future, scope by Team!   MAYBE allow Public streaming too? Hmm

//  TODO:  Can be shared between server and client

const announcements: HostAnnouncementMessage[] = [];

const LEADERBOARD_STAT_MESSAGE_TYPE = "workout-stat";
export interface LeaderboardStatMessage extends Message {
  type: "workout-stat";
  stat: WorkoutStat;
}

//  Log Past Messages?
//  TODO:  SHOULD have coordination around teams and stuff too? Hmm...
const messageLog: any[] = [];

const members: string[] = [];

//  CONSIDER:  WHY can't an aribitrary encoding be used as the KEY and then we have systems to SUPPORT accessing that???
const clientAnnouncementMap: {client: WS; announcement: HostAnnouncementMessage}[] = [];

/**
 * Start Express server.
 */
const initServer = async (): Promise<any> => {
  const app = await initApp();
  const server = app.listen(app.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
  });

  /**
   * Start the Websocket Server
   */

  const ws = new WS.Server({server});

  ws.on("connection", (client) => {
    //  Log the Connection
    console.log("NEW WEBSOCKET CLIENT");
    clients.push(client);

    //  Send Active Hosts on Connect
    const activeHostsMessage: ActiveHostsMessage = {
      type: "active-hosts",
      announcements,
    };
    console.log("Sending ActiveHosts Message");
    console.log(activeHostsMessage);
    client.send(JSON.stringify(activeHostsMessage));

    //  Send Member Status on Connect
    const membersMessage: OnlineMembersMessage = {
      type: ONLINE_MEMBERS_MESSAGE_TYPE,
      members,
    };
    console.log("Sending Members Message");
    console.log(membersMessage);
    client.send(JSON.stringify(membersMessage));

    //  Send Debug Info
    // clients.forEach(_client => {
    //   console.log('Sending Client Count: ' + clients.length);
    //   _client.send(JSON.stringify({ type: 'client-count', clientCount: clients.length }));
    // });

    client.on("close", () => {
      //  Get Announcement
      const mapEntry = clientAnnouncementMap.find((entry) => entry.client === client);
      if (mapEntry) {
        //  Remove Announcement (if it exists)
        const announcementIndex = announcements.findIndex((_announcement) => _announcement == mapEntry.announcement);
        if (announcementIndex != -1) {
          announcements.splice(announcementIndex);
        }

        //  Remove ClientAnnouncementMap
        const clientAnnouncementMapIndex = clientAnnouncementMap.findIndex((entry) => entry == mapEntry);
        if (clientAnnouncementMapIndex != -1) {
          clientAnnouncementMap.splice(clientAnnouncementMapIndex);
        }
      }

      //  Clear Client
      const closedClientIndex = clients.findIndex((_client) => _client === client);
      clients.splice(closedClientIndex, 1);
    });

    client.on("message", (rawMessage: any) => {
      //  Parse Message
      const message: Message = JSON.parse(rawMessage);
      messageLog.push(message);

      //
      //  WebRTC
      //

      if (message.type === HOST_CLOSE_MESSAGE_TYPE) {
        const hostCloseMessage = message as HostCloseMessage;
        console.log("Received HostCloseMessage from " + hostCloseMessage.user.username);

        //  Remove Announcement (if it exists)
        const announcementIndex = announcements.findIndex((announcement) => announcement.user?.username === hostCloseMessage.user?.username);
        if (announcementIndex != -1) {
          announcements.splice(announcementIndex);
        }

        //  Remove ClientAnnouncementMap Entry (if it exists)
        //  TODO:  Ensure users can only send WS messages with their OWN user!  So.. WS ACL!
        const clientAnnouncementMapIndex = clientAnnouncementMap.findIndex((entry) => entry.announcement.user.username === hostCloseMessage.user?.username);
        if (clientAnnouncementMapIndex != -1) {
          clientAnnouncementMap.splice(clientAnnouncementMapIndex);
        }
      }

      if (message.type === "offer") {
        const offerMessage = message as OfferMessage;
        console.log("Offer Received!");

        //  Check Existing
        // const existing = offers.find(offer => offer.user.username === message.user.username);
        // if (existing) {
        //   existing.offer = offerMessage.offer;
        //   existing.user = offerMessage.user;
        // } else {
        //   offers.push(offerMessage);
        // }
      }

      if (message.type === "host-announcement") {
        const announcementMessage = message as HostAnnouncementMessage;
        console.log("Received HostAnnouncement from " + announcementMessage.user.username);

        const existing = announcements.find((offer: any) => offer.user.username === message.user.username);
        if (!existing) {
          announcements.push(announcementMessage);
          clientAnnouncementMap.push({announcement: announcementMessage, client});
        }

        // announcements.push(announcementMessage);

        //  TODO:  Check Existing?
        // //  Check Existing
        // const existing = offers.find(offer => offer.user.username === message.user.username);
        // if (existing) {
        //   existing.offer = offerMessage.offer;
        //   existing.user = offerMessage.user;
        // } else {
        //   offers.push(offerMessage);
        // }
      }

      if (message.type === "new-subscriber") {
        console.log("Received New Subscriber Message: " + JSON.stringify(message));
      }

      //
      //  Leaderboard
      //

      if (message.type === "workout-stat") {
        const leaderboardStatMessage = message as LeaderboardStatMessage;
        console.log("Received LeaaderboardStat Message:" + JSON.stringify(leaderboardStatMessage));

        const {stat, user} = leaderboardStatMessage;
        const {workoutId} = stat;

        //  Make the Client Pool
        if (!workoutClientMap[workoutId]) {
          workoutClientMap[workoutId] = [];
        }
        const clientPool = workoutClientMap[workoutId];

        //  Add the Client to the Pool (if needed)
        if (clientPool.indexOf(client) == -1) {
          clientPool.push(client);
        }

        //  Broadcast
        clientPool.forEach((recipient) => {
          recipient.send(JSON.stringify(leaderboardStatMessage));
        });

        return;
      }

      //
      //  Indicators
      //

      if (message.type === REGISTER_MEMBER_MESSAGE_TYPE) {
        console.log("Received RegisterMember Message");

        //  Cast the Message
        //  CONSIDER:  Can NORMALIZE this outside as a cross-concern.
        const registerMemeberMessage: RegisterMemberMessage = message as RegisterMemberMessage;
        const memberName = registerMemeberMessage.user?.username;
        if (!memberName) {
          return;
        }

        if (members.includes(memberName)) {
          return;
        }

        members.push(memberName);

        //  Online Members Message
        const membersMessage: OnlineMembersMessage = {
          type: ONLINE_MEMBERS_MESSAGE_TYPE,
          members,
        };

        //  TODO:  This is to solve a race condition between the HOME page when we send the messsage and receive it on the Boathouse page.  We SHOULD perhaps use a singleton WS instance on the client, perhaps adding handlers using the registration pattern as I do in lots of other apps.
        delay(() => {
          console.log("Sending Members Message");
          console.log(membersMessage);
          client.send(JSON.stringify(membersMessage));
        }, 5000);
      }

      if (message.type === UNREGISTER_MEMBER_MESSAGE_TYPE) {
        console.log("Received UnregisterMember Message");

        //  Cast the Message
        //  CONSIDER:  Can NORMALIZE this outside as a cross-concern.
        const unregisterMemeberMessage: UnRegisterMemberMessage = message as UnRegisterMemberMessage;
        const memberName = unregisterMemeberMessage.user?.username;
        if (!memberName) {
          return;
        }

        if (!members.includes(memberName)) {
          return;
        }

        members.splice(members.indexOf(memberName));

        //  Online Members Message
        const membersMessage: OnlineMembersMessage = {
          type: ONLINE_MEMBERS_MESSAGE_TYPE,
          members,
        };

        console.log("Sending Members Message");
        console.log(membersMessage);
        client.send(JSON.stringify(membersMessage));
      }

      //
      //  Global Forwarding
      //  TODO:  This MAY be too much.  Be more surgical about what messages are sent.  SHOULD be OK for now!
      //
      clients.forEach((_client) => {
        if (client !== _client) {
          _client.send(JSON.stringify(message));
        }
      });
    });
  });

  return server;
};

initServer();
