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
    backgroundColor: "#212529",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  homeHeaderLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  homeHeaderAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 36,
    color: "white",
    textAlign: "center",
  },
  pfhsCard: {
    backgroundColor: "#212529",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  pfhsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pfhsTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.5,
  },
  pfhsScoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  pfhsScoreValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 42,
    color: "#fff",
    lineHeight: 46,
  },
  pfhsScoreMax: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  pfhsStatusBadge: {
    marginLeft: "auto",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  pfhsStatusText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pfhsSubscores: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  pfhsSubscoreItem: {
    flex: 1,
    alignItems: "center",
  },
  pfhsSubscoreLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pfhsSubscoreValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 17,
    color: "#fff",
  },
  pfhsBudgetHint: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#fbc02d",
    marginTop: 12,
  },
  pfhsInsightsContainer: {
    marginTop: 12,
    gap: 6,
  },
  pfhsInsightItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  pfhsInsightText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#e0e0e0",
    lineHeight: 18,
  },
  pfhsLoadingText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    color: "#999",
  },
  pfhsEmptyText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    color: "#999",
  },

  // ************** Accounts **************

  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addAccountButton: {
    padding: 8,
  },
  accountHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  accountCardGroup: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  accountCard: {
    backgroundColor: "#212529",
    height: 100,
    width: 160,
    borderRadius: 10,
    padding: 14,
    justifyContent: "space-between",
  },
  accountCardAnnotation: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  accountCardBalance: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#e0e0e0",
  },
  accountCardType: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  accountCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
  },
  accountEmptyText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#666",
  },

  // ************** Budget  **************
  budgetCard: {
    borderWidth: 1,
    borderColor: "white",
    borderCurve: "circular",
    // height: 90,
    width: 180,
    borderRadius: 5,
    padding: 10,
  },
  priceRow: {
    marginTop: 5,
  },
  budgetCardIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  highlight: {
    color: "gray",
  },
  budgetCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
  },

  // ************** Summary **************

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addSummaryButton: {
    padding: 8,
  },
  summaryHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  summaryCardGroup: {
    backgroundColor: "#212529",
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  summaryCardLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryCardValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "#fff",
  },
  summaryCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
    textAlign: "center",
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

  // ************** Report Page  **************

  reportPageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  reportPageHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "white",
  },

  // ************** Transaction Component **************

  transactiontHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionButton: {
    padding: 8,
  },
  transactionHeaderText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  transactionCardGroup: {
    marginTop: 12,
    gap: 10,
  },
  transactionCard: {
    backgroundColor: "#212529",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionCardLeft: {
    flex: 1,
  },
  transactionCardCategory: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#fff",
  },
  transactionCardAccount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  transactionCardRight: {
    alignItems: "flex-end",
  },
  transactionCardAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#fff",
  },
  transactionCardAmountDeduct: {
    color: "#888",
  },
  transactionCardDate: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  transactionCardText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
  },
  transactionEmptyText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingVertical: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ledgerText: {
    color: "white",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    fontWeight: "500",
  },

  // ************** Swipe Actions **************

  swipeActionLeft: {
    backgroundColor: "#007AFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  swipeActionRight: {
    backgroundColor: "#FF3B30",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  swipeActionText: {
    color: "#ffffff",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    marginTop: 4,
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

  // ************** Report Page Charts **************

  reportSection: {
    marginTop: 20,
  },
  reportSectionTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  chartContainer: {
    backgroundColor: "#212529",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
  },
  totalSummaryContainer: {
    backgroundColor: "#212529",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  totalSummaryItem: {
    alignItems: "center",
  },
  totalSummaryLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  totalSummaryValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "white",
  },
  totalSummaryValueIncome: {
    color: "#e0e0e0",
  },
  totalSummaryValueSpending: {
    color: "#888",
  },

  // ************** Date Filter UI **************

  dateFilterContainer: {
    backgroundColor: "#212529",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  dateFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateFilterLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#999",
    width: 50,
  },
  dateFilterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "white",
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    backgroundColor: "#1a1a1a",
  },
  settingsIconButton: {
    padding: 8,
  },
  quickFilterContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  quickFilterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#333",
    alignItems: "center",
  },
  quickFilterButtonActive: {
    backgroundColor: "#555",
  },
  quickFilterText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
  },
  quickFilterTextActive: {
    color: "white",
  },

  // ************** Ledger Cards **************

  ledgerSection: {
    marginTop: 15,
  },
  ledgerCard: {
    backgroundColor: "#212529",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ledgerCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ledgerCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  ledgerCardTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
  },
  ledgerCardSubtitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  ledgerCardAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
  },
  ledgerCardAmountIncome: {
    color: "#e0e0e0",
  },
  ledgerCardAmountSpending: {
    color: "#888",
  },

  // ************** Category Modal **************

  categoryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  categoryModalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "80%",
    maxHeight: "90%",
  },
  categoryModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  categoryModalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryModalTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "white",
  },
  categoryModalBody: {
    padding: 16,
  },
  pieChartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  categoryListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  categoryListLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryName: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "white",
  },
  categoryAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#999",
  },
  categoryPercentage: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },

  // ************** Summary Card Pressable **************

  summaryCardPressable: {
    width: "48%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
  },

  // ************** Profile Screen **************

  profileSection: {
    marginTop: 20,
    backgroundColor: "#212529",
    borderRadius: 10,
    padding: 15,
  },
  profileSectionTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileInfoItemLast: {
    borderBottomWidth: 0,
  },
  profileInfoLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#888",
  },
  profileInfoValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#fff",
  },
  profileButton: {
    backgroundColor: "#333",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  profileButtonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#000",
  },

  // ************** Category Screen Header **************

  categoryScreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 20,
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 4,
  },
  categoryScreenHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryScreenTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#252525",
  },

  // ************** Forecast Card **************

  forecastCard: {
    backgroundColor: "#212529",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  forecastTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#fff",
    letterSpacing: 0.5,
  },
  forecastMessage: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#e0e0e0",
    marginBottom: 16,
    lineHeight: 22,
  },
  forecastStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
  },
  forecastStatItem: {
    flex: 1,
    alignItems: "center",
  },
  forecastStatLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  forecastStatValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#fff",
  },
  forecastAlert: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.3)",
  },
  forecastAlertText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#ff8a80",
    textAlign: "center",
  },

  // ************** Transaction Detail Page **************
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#252525",
  },
  detailHeaderTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  detailContent: {
    flex: 1,
    paddingBottom: 20,
  },
  detailActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: "#ffffff",
  },
  deleteButton: {
    backgroundColor: "#ffffff",
  },
  actionButtonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "#00000",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#252525",
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  detailLabel: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  detailValue: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  amountText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
  },
  deductText: {
    fontFamily: "SpaceMono_400Regular",
    color: "#FF3B30",
  },
  addText: {
    fontFamily: "SpaceMono_400Regular",
    color: "#34C759",
  },
  errorText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },

  // ************** Budget Overview **************

  budgetOverviewSection: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  budgetOverviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetOverviewTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  manageBudgetButton: {
    // backgroundColor: "#007AFF",
    // paddingVertical: 8,
    // paddingHorizontal: 14,
    // borderRadius: 8,
    // shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  manageBudgetButtonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  budgetItemCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  budgetItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  budgetCategoryName: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
    fontWeight: "500",
  },
  budgetAmountText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  budgetProgressBarContainer: {
    height: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  budgetProgressBar: {
    height: "100%",
    borderRadius: 5,
  },
  budgetPercentageText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    fontWeight: "500",
  },
  budgetEmptyState: {
    padding: 24,
    alignItems: "center",
  },
  budgetEmptyStateText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },

  // ************** Budget Management Modal **************

  budgetModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  budgetModalContent: {
    backgroundColor: "#1e1e1e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "70%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  budgetModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  budgetModalTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  budgetModalBody: {
    padding: 20,
  },
  budgetFormSection: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  budgetFormTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  budgetListSection: {
    marginTop: 10,
  },
  budgetListTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  budgetListItem: {
    backgroundColor: "#252525",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  budgetListItemLeft: {
    flex: 1,
  },
  budgetListItemCategory: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 15,
    color: "white",
    fontWeight: "500",
  },
  budgetListItemAmount: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 13,
    color: "#999",
    marginTop: 6,
  },
  budgetListItemActions: {
    flexDirection: "row",
    gap: 10,
  },
  budgetEditButton: {
    backgroundColor: "#333",
    borderColor: "#555",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 6,
  },
  budgetDeleteButton: {
    backgroundColor: "#333",
    borderColor: "#555",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  budgetActionButtonText: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  budgetEditForm: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 16,
    marginTop: -2,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#444",
  },
  budgetEditFormTitle: {
    fontFamily: "SpaceMono_400Regular",
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  budgetEditFormButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  budgetSaveButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  budgetCancelEditButton: {
    flex: 1,
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  // ************** Category Swipe Actions **************
  swipeActionLeft: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeActionRight: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeActionText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600',
  },
  swipeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
