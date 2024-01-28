# WeGoWhere Backend Test

Backend Test for WeGoWhere. Chat API that emphasizes on real-time communication and message delivery.

## Tech Stacks

- [Node.js](https://nodejs.org)
- [TypeScript](https://typescriptlang.org)
- [Nest.js](https://nestjs.com)
- [MongoDB](https://mongodb.com)
- [Redis](https://redis.io)
- [RabbitMQ](https://rabbitmq.com)

## Microservices

- [User](apps/user/)
- [Auth](apps/auth/)
- [Chat](apps/chat/)
- [Gateway](apps/gateway/)

## Environment

Environment variables are available in `.env.template` file.

## Installation

```zsh
npm i
```

## Development

```zsh
npm run start:dev $SVC
```

Where `$SVC` is service name of `gateway`, `user`, `auth`, and `chat`.

## Docker Image

Build Docker image for each microservice.

```zsh
docker build -t wegowhere-backend-test --build-arg SVC=$SVC .
```

Where `$SVC` is service name of `gateway`, `user`, `auth`, and `chat`.

## Deployment

You can user Docker Compose, Docker Swarm, or Kubernetes. Note that reverse proxy has to point to `gateway` service.

## Usage

1. Sign up or sign in to retrieve an access token.
    - `POST /api/v1/auth/sign-up`
      - Request

        ```json
        {
          "first_name": "required string",
          "last_name:": "required optional string",
          "username": "string with minimum length of 6 characters",
          "password": "string with minimum length of 6 characters"
        }
        ```

      - Response

        ```json
        {
          "success": "boolean",
          "timestamp": "Date",
          "data": {
            "access": "string",
            "refresh": "string"
          }
        }
        ```

    - `POST /api/v1/auth/sign-in`
      - Request

        ```json
        {
          "username": "string with minimum length of 6 characters",
          "password": "string with minimum length of 6 characters"
        }
        ```

      - Response

        ```json
        {
          "success": "boolean",
          "timestamp": "Date",
          "data": {
            "access": "string",
            "refresh": "string"
          }
        }
        ```

2. Create or join an existing room.
    - `POST /api/v1/chat/rooms`
      - Headers

        ```json
        {
          "Authorization": "Bearer ACCESS_TOKEN"
        }
        ```

      - Request

        ```json
        {
          "name": "required string"
        }
        ```

      - Response

        ```json
        {
          "success": "boolean",
          "timestamp": "Date",
          "data": {
            "_id": "ObjectId",
            "name": "string",
            "created_at": "Date",
            "updated_at": "Date"
          }
        }
        ```

    - `POST /api/v1/chat/rooms/join`
      - Headers

        ```json
        {
          "Authorization": "Bearer ACCESS_TOKEN"
        }
        ```

      - Request

        ```json
        {
          "room_id": "required ObjectId"
        }
        ```

      - Response

        ```json
        {
          "success": "boolean",
          "timestamp": "Date"
        }
        ```

3. Use `room_id` and access token to connect to socket server.
    - Headers

      ```json
      {
        "Authorization": "Bearer ACCESS_TOKEN"
      }
      ```

    - Body
4. Subscribe to `chat.message.receive` event to receive messages.
    - Headers

      ```json
      {
        "Authorization": "Bearer ACCESS_TOKEN"
      }
      ```

    - Body

      ```json
      {
        "room_id": "required ObjectId",
        "content": "required string"
      }
      ```

5. Send an event of `chat.message.send` to send a message.
    - Headers

      ```json
      {
        "Authorization": "Bearer ACCESS_TOKEN"
      }
      ```

    - Body

      ```json
      {
        "_id": "ObjectId",
        "room_id": "ObjectId",
        "user_id": "ObjectId",
        "content": "string",
        "created_at": "Date",
        "updated_at": "Date",
        "user": {
          "_id": "ObjectId",
          "first_name": "string",
          "last_name": "string",
          "username": "string",
          "created_at": "Date",
          "updated_at": "Date",
        }
      }
      ```

The rest of API endpoint documentations is available at `http://${GATEWAY_HOST}:${GATEWAY_PORT}/docs`.

## License

[MIT](LICENSE)
