var data = require("./../data.json"),
  config = require("./../config.json");

module.exports = {
  get: function(req, res, next) {
    var resource = req.params.resource,
      itemArg = req.params[0] || req.query.id || null,
      items;

    if (data[resource] && !itemArg) {
      return returnAll(data[resource], req, res);
    } else if (data[resource] && itemArg) {
      items = data[resource];
      return returnSingle(items, itemArg, res);
    } else if (!data[resource] && !itemArg) {
      return returnAll(data.unknown, req, res);
    } else if (!data[resource] && itemArg) {
      items = data.unknown;
      return returnSingle(items, itemArg, res);
    }
  },

  post: function(req, res, next) {
    var id =
        req.body.id ||
        Math.ceil(Math.random() * 1000)
          .toString()
          .substring(0, 3),
      returnData = req.body;
    returnData.id = id;
    returnData.createdAt = new Date().toISOString();

    return res.status(201).send(returnData);
  },

  put: function(req, res, next) {
    var returnData = req.body;
    returnData.updatedAt = new Date().toISOString();
    return res.status(200).send(returnData);
  },

  patch: function(req, res, next) {
    var returnData = req.body;
    returnData.updatedAt = new Date().toISOString();
    return res.status(200).send(returnData);
  },

  delete: function(req, res, next) {
    return res.status(204).send({});
  },

  login: function(req, res, next) {
    if (req.body.username || req.body.email) {
      if (req.body.password) {
        const username = req.body.username || req.body.email;
        const user = data.users.find(
          usersearch => usersearch.email === username
        );
        if (user) {
          const token = data.tokens.find(token => token.id === user.id);
          if (token) {
            return res.status(200).send({
              token: token.token
            });
          }
        } else {
          return res.status(400).send({
            error: "user not found"
          });
        }
      } else {
        return res.status(400).send({
          error: "Missing password"
        });
      }
    } else {
      return res.status(400).send({
        error: "Missing email or username"
      });
    }
  },

  register: function(req, res, next) {
    if (req.body.username || req.body.email) {
      if (req.body.password) {
	const username = req.body.username || req.body.email;
        const user = data.users.find(
          usersearch => usersearch.email === username
        );
        if (user) {
          const token = data.tokens.find(token => token.id === user.id);
          if (token) {
            return res.status(200).send({
              id: user.id,
              token: token.token
            });
          }
        } else {
          return res.status(400).send({
            error: "Note: Only defined users succeed registration"
          });
        }
      } else {
        return res.status(400).send({
          error: "Missing password"
        });
      }
    } else {
      return res.status(400).send({
        error: "Missing email or username"
      });
    }
  },

  logout: function(req, res, next) {
    return res.status(200).send({});
  },

  redirect: function(req, res, next) {
    return res.redirect(302, req.query.url);
  }
};

function returnAll(items, req, res) {
  var filterByPreffix = "filter_by_";
  var page = parseInt(req.query.page, 10) || 1,
    pageSize = parseInt(req.query.per_page, 10) || config.pagination.page_size,
    offset = (page - 1) * pageSize,
    filters = Object.keys(req.query)
      .filter(key => key.indexOf(filterByPreffix) !== -1)
      .map(key => key.replace(new RegExp(`^${filterByPreffix}`), ""))
      .filter(key => key.length),
    filteredItems = items.reduce(
      (itemPrevious, itemCurrent) =>
        itemPrevious.concat(
          filters.reduce(
            (filterPrevious, filterCurrent) =>
              !filterPrevious
                ? false
                : !(
                    typeof itemCurrent[filterCurrent] !== "string" ||
                    itemCurrent[filterCurrent].indexOf(
                      query[`${filterByPreffix}${filterCurrent}`]
                    ) === -1
                  ),
            true
          )
            ? [itemCurrent]
            : []
        ),
      []
    ),
    /*filteredItems = items.filter(item => {
			for(let filter of filters) {
				if (typeof item[filter] !== 'string' || item[filter].indexOf(query[`${filterByPreffix}${filter}`]) === -1) {
					return false;
				}
			}

			return true;
		}),*/
    paginatedItems = filteredItems.slice(offset, offset + pageSize);

  return res.status(200).send({
    page: page,
    per_page: pageSize,
    total: filteredItems.length,
    total_pages: Math.ceil(filteredItems.length / pageSize),
    data: paginatedItems
  });
}

function returnSingle(items, itemArg, res) {
  var singleItem = items.filter(function(item) {
    return item.id == itemArg;
  });
  if (singleItem.length) {
    return res.status(200).send({
      data: singleItem[0]
    });
  }
  return res.status(404).send({});
}
