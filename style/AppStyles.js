import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 35,
    backgroundColor: "#1a1a1a",
    // position: "relative",
    flex: 1,
  },
  containerHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  text: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "white",
  },
  subtext: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "gray",
  },
  floatButton: {
    backgroundColor: "white",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 9,
  },

  // ************** Page Header **************
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  pageButton: {
    borderWidth: 0,
  },
  pageHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "white",
  },

  // ************** Home Header **************

  homeHeader: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  homeHeaderAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 32,
    color: "white",
    textAlign: "center",
  },

  // ************** Accounts **************

  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  addAccountButton: {
    borderWidth: 0,
  },
  accountHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  accountCardGroup: {
    marginTop: 10,
    flexDirection: "row",
    gap: 15,
  },
  accountCard: {
    borderWidth: 1,
    borderColor: "white",
    borderCurve: "circular",
    height: 90,
    width: 180,
    borderRadius: 5,
    padding: 10,
  },
  accountCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
  },

  // ************** Transaction  **************

  transactiontPageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  transactionPageHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "white",
  },

  // ************** Transaction Component **************

  transactiontHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  transactionButton: {
    borderWidth: 0,
  },
  transactionHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  transactionCardGroup: {
    marginTop: 10,
    // flexDirection: "row",
    gap: 15,
  },
  transactionCard: {
    borderWidth: 1,
    borderColor: "white",
    borderCurve: "circular",
    height: "auto",
    width: "100%",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  transactionCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
  },

  // ************** Modal **************

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#212529",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "white",
  },

  modalContainer: {
    width: "100%",
  },

  modalCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  label: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
  },

  pickerItem: {
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
    paddingLeft: 10,
    // marginTop: "5px",
    color: "white",
    fontFamily: "SpaceMono_400Regular",
  },

  addButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#333",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    fontFamily: "SpaceMono_400Regular",
  },
  toggleButtonTextActive: {
    color: "#e0e0e0",
    fontWeight: "600",
  },

  // ************** Modal **************

  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  filterItem: {
    marginBottom: 12,
  },
  filterLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    marginBottom: 6,
    color: "#e0e0e0",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  pickerCont: {
    fontFamily: "SpaceMono_400Regular",
    height: 50,
    paddingHorizontal: 12,
    color: "#ffffff",
    backgroundColor: "#2a2a2a",
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  resultsCountText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
  },
  emptyState: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  // ************** Ledger **************

  ledgerItem: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: "#999",
    borderWidth: 1,
    borderColor: "transparent",
  },
  ledgerText: {
    color: "white",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
  },

  // ************** Onboarding **************

  pageInput: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
    paddingLeft: 10,
    // marginTop: "5px",
    color: "white",
    fontFamily: "SpaceMono_400Regular",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 30,
    // textAlign: "center",
    color: "white",
    paddingBottom: 20,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    lineHeight: 24,
    color: "gray",
    // textAlign: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 4,
    width: width - 48,
    alignItems: "center",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    color: "black",
  },
  buttonPressed: {
    backgroundColor: "white",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
  },
  footerText: {
    fontFamily: "SpaceMono_400Regular",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 16,
  },

  // **************************** Login ****************************

  loginPageTitle: {
    fontSize: 25,
    fontFamily: "SpaceMono_400Regular",
    // textAlign: "center",
    color: "white",
    paddingBottom: 20,
    lineHeight: 34,
  },

  formWrapper: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "flex-start",
    width: width - 48,
    paddingHorizontal: 24,
  },

  formInput: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 15,
    paddingLeft: 10,
    // marginTop: "5px",
    width: "100%",
    color: "white",
    fontFamily: "SpaceMono_400Regular",
  },
  formLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
    paddingBottom: 10,
  },

  formUrl: {
    paddingVertical: 10,
    textAlign: "right",
  },
  formUrlText: {
    textAlign: "right",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
    paddingBottom: 10,
  },
});

export default styles;
