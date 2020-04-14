class CreatePlayerqueues < ActiveRecord::Migration[5.2]
    def change
      create_table :playerqueues do |t|
        t.integer :player_id
        t.integer :queue_id
        t.timestamps
      end
    end
  end