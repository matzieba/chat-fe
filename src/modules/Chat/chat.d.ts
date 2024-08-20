declare namespace CVT {
  export namespace Permission {
    export interface Permissions {
      chats: CVT.Permission.CrudPermission;
    };
  };
};

declare namespace Chats {

  export namespace Threads {
    export interface Thread {
      additionalData: {
        
      };
      id: number;
      openAiId: string;
      title: string;
      createdAt: Date;
      updatedAt: Date;
    }

    export interface Crud {
      dbConnection: number;
      message?: string;
    }

    export interface Create extends Crud {}

    export type ThreadApi = CVT.CamelToSnakeCase<Thread>;

    export interface ExtendedThread extends Thread {
      messages: Messages.Message[];
      isFinished: boolean;
    }

    export interface ExtendedThreadApi extends ThreadApi {
      messages: Messages.MessageApi[];
      isFinished: boolean;
    }

    export interface ListParams {
      connection: number;
    }

    export type GetListParams = CVT.Query.GetListParams<ListParams>;
  }

  export namespace Messages {

    export type Status = 'created' | 'sending_message_to_assistant' | 'waiting_in_queue' | 'choosing_open_ai_tool' | 'running_api_function' | 'gathering_arguments_from_the_message_and_context' | 'producing_final_message' | 'finished' | 'api_error' | 'open_ai_failed' | 'submitting_response_to_assistant';
    export type MessageType = 'text';
    export type MessageRole = 'assistant' | 'user';

    export interface Step {
      name: Status;
      start: Date;
      end: Date;
      data?: CVT.MaybeNull<any>;
    }

    export interface Message {
      id: string;
      messageText: string;
      role: MessageRole;
      createdAt: Date;
      type: MessageType;
      steps: Step[];
      status: Status;
    }

    export type MessageApi = CVT.CamelToSnakeCase<Message>;

    export interface ListParams {
      thread: number;
    }

    export type GetListParams = CVT.Query.GetListParams<ListParams>;
  }

};
