import React from "react";
import { View,Text} from "react-native";
import EntryCard from "./EntryCard.jsx";

const EntryListTable = ({ entries }) => {
  return (
    <View>
      {entries.map((e) => (
        <EntryCard key={e.id} entry={e} />
      ))}
    </View>
  );
};

export default EntryListTable;
