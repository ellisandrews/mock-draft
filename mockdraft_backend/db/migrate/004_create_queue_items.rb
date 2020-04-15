class CreateQueueItems < ActiveRecord::Migration[5.2]
    def change
        create_table :queue_items do |t|
            t.integer :owner_id
            t.integer :player_id
            t.timestamps
        end
    end
end