import * as TYPES from "./actionTypes.js";

function reducer(state, action) {
  let st = { ...state };
  const { payload } = action;
  let idx;
  switch (action.type) {
    case TYPES.UPDATE_HOME_ITEMS:
      st.homeItems = payload;
      return st;
    case TYPES.UPDATE_TABLE_ORDER:
      st.tableOrders = payload;
      return st;
    case TYPES.UPDATE_SUCCESS_ORDER:
      st.orderSuccess.push(payload);
      return st;

    case TYPES.REFRESH_ORDER_CLOUD:
      st.orderSuccess = [];
      st.orderSuccess = payload;
      return st;

    case TYPES.ADDONS:
      st.addons = [];
      st.addons = payload;
      return st;

    case TYPES.SET_RESTAURANT_NAME:
      st.restName = payload;
      return st;

    case TYPES.UPDATE_TABLE_USERS:
      st.tableUsers = payload;
      return st;
    case TYPES.SET_PLACEORDER_ID:
      st.placeOrderById = payload.users;
      return st;

    case TYPES.SET_TABLE_ID:
      st.tableId = payload._id.$oid;
      return st;
    case TYPES.UPDATE_ORDER_STATUS:
      st.orderSuccess.forEach((item, index) => {
        if (item._id.$oid === payload.table_order_id) {
          item.orders.forEach((item1) => {
            if (item1._id.$oid === payload.order_id) {
              item1.food_list.forEach((item2) => {
                if (item2.food_id === payload.food_id) {
                  item2.status = payload.type;
                  st.orderSuccess[index] = item;
                }
              });
            }
          });
        }
      });

      return st;
    case TYPES.UPDATE_FOOD_MENU:
      st.rawData.food_menu = payload;
      return st;
    case TYPES.UPDATE_TABLE_NAME:
      st.tableName = payload;
      return st;
    case TYPES.ADD_DATA:
      st.rawData = payload;
      return st;
    case TYPES.ADD_TO_CART_DATA:
      return {
        ...st,
        cartData: payload,
      };
    case TYPES.ADD_ITEM:
      if (payload.options) {
        idx = st.cart.findIndex(
          (item) =>
            item._id.$oid === payload._id.$oid &&
            item.options.option_name === payload.options.option_name
        );
      } else if (payload.options === undefined && payload.choices) {
        idx = st.cart.findIndex(
          (item) =>
            item._id.$oid === payload._id.$oid &&
            item.choices === payload.choices
        );
      } else {
        idx = st.cart.findIndex((item) => item._id.$oid === payload._id.$oid);
      }
      if (idx === -1) {
        st.cart.push({
          ...payload, //payload is the id
          quantity: 1,
        });
      } else {
        st.cart = st.cart.map((item) => {
          if (
            (item._id.$oid === payload._id.$oid &&
              item.options.option_name === payload.options.option_name) ||
            (item.choices !== undefined && item.choices === payload.choices)
          ) {
            ++item.quantity;
          }
          return item;
        });
      }
      return st;
    case TYPES.INC_ITEM:
      if (payload.options) {
        st.cart = st.cart.map((item) => {
          if (
            item._id.$oid === payload._id.$oid &&
            item.options.option_name === payload.options.option_name
          )
            ++item.quantity;
          return item;
        });
      } else if (payload.options === undefined && payload.choices) {
        st.cart = st.cart.map((item) => {
          if (
            item._id.$oid === payload._id.$oid &&
            item.choices === payload.choices
          )
            ++item.quantity;
          return item;
        });
      } else {
        st.cart = st.cart.map((item) => {
          if (item._id.$oid === payload._id.$oid) ++item.quantity;
          return item;
        });
      }

      return st;
    case TYPES.DEC_ITEM:
      if (payload.options) {
        st.cart = st.cart.map((item) => {
          if (
            item._id.$oid === payload._id.$oid &&
            item.options.option_name === payload.options.option_name
          )
            --item.quantity;
          return item;
        });
      } else if (payload.options === undefined && payload.choices) {
        st.cart = st.cart.map((item) => {
          if (
            item._id.$oid === payload._id.$oid &&
            item.choices === payload.choices
          )
            --item.quantity;
          return item;
        });
      } else {
        st.cart = st.cart.map((item) => {
          if (item._id.$oid === payload._id.$oid) --item.quantity;
          return item;
        });
      }
      return st;
    case TYPES.DEL_ITEM:
      if (payload.options) {
        st.cartData.forEach((data) => {
          data.food_list.forEach((item) => {
            if (item.name === payload.name) {
              delete item.choices;
              delete item.options;
              delete item.showCustomize;
              delete item.showPopup;
              delete item.showOptionsAgain;
              delete item.foodOptions;
            }
          });
        });
        idx = st.cart.findIndex(
          (item) =>
            item._id.$oid === payload._id.$oid &&
            item.options.option_name === payload.options.option_name
        );
      } else if (payload.options === undefined && payload.choices) {
        st.cartData.forEach((data) => {
          data.food_list.forEach((item) => {
            if (item.name === payload.name) {
              delete item.choices;
              delete item.options;
              delete item.showCustomize;
              delete item.showPopup;
              delete item.showOptionsAgain;
              delete item.foodOptions;
            }
          });
        });
      } else {
        idx = st.cart.findIndex((item) => item._id.$oid === payload._id.$oid);
      }
      if (idx !== -1) st.cart.splice(idx, 1);

      return st;

    case TYPES.DEL_TABLE_ITEM:
      idx = st.tableOrders.orders.findIndex((item) =>
        item.food_list.map((item1) => item1.food_id === payload.food_id)
      );

      if (idx !== -1) st.tableOrders.orders.splice(idx, 1);

      return st;

    case TYPES.UPDATE_REST_ID:
      st.restId = payload;
      return st;

    case TYPES.UPDATE_MENU_CLICK:
      st.menuClick = payload;
      return st;

    case TYPES.UPDATE_FAB_CLICK:
      st.fabClick = payload;
      return st;

    case TYPES.SET_NAV:
      st.activeNav = payload;
      return st;
    case TYPES.ADD_COLLECTIVE_FOODITEMS:
      st.justMenuItems = payload;
      return st;
    case TYPES.ADD_COLLECTIVE_BARITEMS:
      st.justBarItems = payload;
      return st;
    case TYPES.SET_GENERAL_DATA:
      return { ...st, ...payload };

    case TYPES.SET_DINE_HISTORY:
      st.dineHistory = payload;
      return st;

    case TYPES.RESET_CART:
      st.cart = [];
      return st;

    case TYPES.ADD_REST_ADDRESS:
      st.restAddress = payload;
      return st;
    case TYPES.ADD_REST_IMAGES:
      st.restImages = payload;
      return st;
    case TYPES.ADD_REST_LOGO:
      st.restLogo = payload;
      return st;
    case TYPES.ORDERING_ABILITY:
      st.orderingAbility = payload;
      return st;
    case TYPES.DISPLAY_ORDER_BUTTONS:
      st.displayOrderButtons = payload;
      return st;
    case TYPES.THEME_PROPERTIES:
      st.themeProperties = payload;
      return st;
    default:
      return state;
  }
}

export default reducer;
