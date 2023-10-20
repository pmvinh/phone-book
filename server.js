const main = async () => {
  const PORT = process.env.PORT || 8080;

  // подключение модулей
  const express = require("express");
  const bodyParser = require("body-parser");
  const mongodb = require("mongodb");

  const ObjectId = mongodb.ObjectId;

  const app = express();

  app.use(bodyParser.json());

  app.use(express.static(__dirname + "/dist/"));

  app.use((_, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
  });

  // подключение к базе данных
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");

  const db = client.db("test");
  const collection = db.collection("contacts");

  console.log("Соединение с БД прошло успешно!");

  // открытие порта
  app.listen(PORT, () => {
    console.log(`Приложение запущено на порте ${PORT}`);
  });

  // реализация REST API
  /**
   * GET /v1/contacts
   * Возвращает список телефонных контактов
   */
  app.get("/v1/contacts", async (request, response) => {
    console.log("GET /v1/contacts");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.send(await collection.find().toArray());
  });

  /**
   * POST /v1/contacts
   * Добавляет телефонный контакт в БД
   */
  app.post("/v1/contacts", async (request, response) => {
    console.log("POST /v1/contacts");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.contentType("json");

    const body = request.body;

    // все поля объекта должны быть заполнены
    if (
      !("username" in body)
      || !("email" in body)
      || !("mobile" in body)
      || !("home" in body)
    ) {
      response.status(400);

      response.send(JSON.stringify({
        message: "Неполные данные! Невозможно выполнить запрос!",
      }));

      return;
    }

    const res = await collection.insertOne(body);

    response.status(200);
    response.send(JSON.stringify({
      _id: res["insertedId"],
      ...body
    }));
  });

  /**
   * DELETE /v1/contacts
   * Удаляет все записи из базы данных
   */
  app.delete("/v1/contacts", async (request, response) => {
    console.log("DELETE /v1/contacts");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.contentType("json");

    await collection.deleteMany({});

    response.status(200);
    response.send(JSON.stringify({
      message: "Все записи были удалены!",
    }));
  });

  /**
   * GET /v1/contacts/:id
   * Возвращает телефонный контакт с идентификатором id
   */
  app.get("/v1/contacts/:id", async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (!request.params.id) {
      response.status(400);
      response.send(JSON.stringify({
        message: "Не задан id записи! Невозможно выполнить запрос!",
      }));

      return;
    }

    const id = request.params.id;

    console.log(`GET /v1/contacts/${id}`);
    response.contentType("json");

    const result = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    response.status(200);
    response.send(result);
  });

  /**
   * DELETE /v1/contacts/:id
   * Удаляет запись с идентификатором id из базы данных
   */
  app.delete("/v1/contacts/:id", async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (!request.params.id) {
      response.status(400);
      response.send(JSON.stringify({
        message: "Не задан id записи! Невозможно выполнить запрос!",
      }));

      return;
    }

    const id = request.params.id;

    console.log(`DELETE /v1/contacts/${id}`);
    response.contentType("json");

    await collection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });

    response.status(200);
    response.send(JSON.stringify({
      deletedId: id,
    }));
  });

  /**
   * PUT /v1/contacts/:id
   * Обновляет запись с идентификатором id
   */
  app.put("/v1/contacts/:id", async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (!request.params.id) {
      response.status(400);
      response.send(JSON.stringify({
        message: "Не задан id записи! Невозможно выполнить запрос!",
      }));

      return;
    }

    const id = request.params.id;

    console.log(`PUT /v1/contacts/${id}`);
    response.contentType("json");

    const body = request.body;
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: {
          "username": body["username"],
          "email": body["email"],
          "mobile": body["mobile"],
          "home": body["home"],
        }
      },
    );

    response.status(200);
    response.send(JSON.stringify({
      message: `Запись с id = ${id} успешно обновлена!`,
    }));
  });
};

main()
  .catch(console.error);
