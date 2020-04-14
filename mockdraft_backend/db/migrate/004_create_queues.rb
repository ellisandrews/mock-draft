class CreateQueues < ActiveRecord::Migration[5.2]
    def change
        create_table :queues do |t|
            t.string :name
            t.integer :owner_id
            t.timestamps
        end
    end
end