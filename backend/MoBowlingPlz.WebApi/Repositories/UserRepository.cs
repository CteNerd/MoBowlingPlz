using Microsoft.Extensions.Options;
using Npgsql;
using System;
using System.Collections.Generic;

public class UserRepository
{
    private readonly string _connectionString;

    public UserRepository(IOptions<AppSettings> appSettings)
    {
        Console.WriteLine("UserRepository constructor called");
        _connectionString = appSettings.Value.PostgresConnection;
    }

    public IEnumerable<string> GetUsers()
    {
        Console.WriteLine("GetUsers method called");
        var users = new List<string>();

        using var connection = new NpgsqlConnection(_connectionString);
        connection.Open();

        using var command = new NpgsqlCommand("SELECT username FROM users", connection);
        using var reader = command.ExecuteReader();

        while (reader.Read())
        {
            users.Add(reader.GetString(0)); // Adjust based on your table structure
        }

        return users;
    }

    public void CreateUser(string name, string email, string password)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var command = new NpgsqlCommand("INSERT INTO users (name, email) VALUES (@name, @email)", connection);
            command.Parameters.AddWithValue("@name", name);
            command.Parameters.AddWithValue("@email", email);

            command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred while creating the user: " + ex.Message);
            throw;
        }
    }
}