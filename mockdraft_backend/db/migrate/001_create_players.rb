class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players do |t|
      t.string :position
      t.string :roster_position
      t.string :first_name
      t.string :last_name
      t.string :team
      t.float :nerd_rank
      t.integer :position_rank
      t.integer :overall_rank
      t.integer :bye_week
      t.integer :roster_id

      t.timestamps
    end
  end
end